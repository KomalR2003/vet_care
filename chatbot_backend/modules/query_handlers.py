from logger import logger

def query_chain(chain_components, user_input: str):
    """Process user query using hybrid approach (documents + general knowledge)"""
    try:
        logger.info(f"User input: {user_input}")

        document_chain = chain_components["document_chain"]
        general_chain = chain_components["general_chain"]
        retriever = chain_components["retriever"]

        # First, try to get relevant documents
        logger.debug("Starting document retrieval...")
        relevant_docs = retriever.get_relevant_documents(user_input)
        
        if relevant_docs:
            # We have relevant documents, use document-based chain
            logger.debug(f"Found {len(relevant_docs)} relevant documents, using document-based response")
            
            # Build context from documents
            context = ""
            sources = []
            for doc in relevant_docs:
                snippet = doc.get("content", "")[:800]  # Increased snippet size
                context += snippet + "\n\n"
                source = doc.get("source", "")
                doc_type = doc.get("document_type", "document")
                page = doc.get("page", 0) if doc.get("page") else ""
                
                if source:
                    if doc_type == "pdf" and page:
                        source_info = f"{source} (page {page})"
                    elif doc_type == "json":
                        metadata = doc.get("metadata", {})
                        if metadata.get("key"):
                            source_info = f"{source} (key: {metadata['key']})"
                        else:
                            source_info = source
                    else:
                        source_info = source
                    sources.append(source_info)

            logger.debug("Calling LLM with document context...")
            # Use invoke method with the new chain
            result = document_chain.invoke({"context": context, "question": user_input})
            
            # Extract content from AIMessage object
            response_text = result.content if hasattr(result, 'content') else str(result)
            
            response = {
                "response": response_text,
                "sources": list(set(sources)),  # deduplicate
                "response_type": "document_based"
            }
            
        else:
            # No relevant documents found, use general knowledge
            logger.debug("No relevant documents found, using general knowledge response")
            
            logger.debug("Calling LLM for general knowledge...")
            result = general_chain.invoke({"question": user_input})
            
            # Extract content from AIMessage object
            response_text = result.content if hasattr(result, 'content') else str(result)
            
            response = {
                "response": response_text,
                "sources": [],
                "response_type": "general_knowledge"
            }

        logger.debug(f"Final response type: {response['response_type']}")
        return response

    except Exception as e:
        logger.exception("Error in query_chain")
        # Fallback to general knowledge in case of error
        try:
            logger.info("Attempting fallback to general knowledge...")
            general_chain = chain_components["general_chain"]
            result = general_chain.invoke({"question": user_input})
            response_text = result.content if hasattr(result, 'content') else str(result)
            return {
                "response": response_text,
                "sources": [],
                "response_type": "fallback_general"
            }
        except Exception as fallback_error:
            logger.exception("Fallback also failed")
            raise e