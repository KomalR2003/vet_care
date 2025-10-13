const Report = require('../models/Report');
const Pet = require('../models/Pet');
const Doctor = require('../models/Doctor');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.createReport = async (req, res) => {
  try {
    const { pet, appointment, summary, diagnosis, prescription, notes, medications, recommendations } = req.body;
    
    // Basic validation
    if (!pet || !summary) {
      return res.status(400).json({ error: 'Pet and summary are required' });
    }

    // Get doctor profile
    const doctorProfile = await Doctor.findOne({ userId: req.user._id }).populate('userId');
    if (!doctorProfile) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }

    // Get pet details
    const petDetails = await Pet.findById(pet).populate('owner');
    if (!petDetails) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    // Ensure pet has an owner (data integrity check)
    if (!petDetails.owner) {
      return res.status(404).json({ error: 'Pet owner not found' });
    }

    // Create report
    const report = new Report({
      pet,
      owner: petDetails.owner, // accept either populated doc or ObjectId
      doctor: doctorProfile._id,
      appointment,
      date: new Date(),
      summary,
      diagnosis,
      prescription,
      notes,
      medications: medications || [],
      recommendations: recommendations || []
    });

    await report.save();

    // Add report to pet's reports array
    petDetails.reports.push(report._id);
    await petDetails.save();

    // Populate report before sending response
    const populatedReport = await Report.findById(report._id)
      .populate('pet')
      .populate('owner', 'name email phone')
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'name' }
      })
      .populate('appointment');

    res.status(201).json(populatedReport);
  } catch (err) {
    console.error('Error creating report:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const filter = {};
    
    // Role-based filtering
    if (req.user.role === 'pet owner') {
      filter.owner = req.user._id;
    } else if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ userId: req.user._id });
      if (!doctorProfile) {
        return res.status(404).json({ error: 'Doctor profile not found' });
      }
      filter.doctor = doctorProfile._id;
    }
    
    // Query parameters for additional filtering
    if (req.query.pet) filter.pet = req.query.pet;
    if (req.query.doctor) filter.doctor = req.query.doctor;
    if (req.query.owner) filter.owner = req.query.owner;
    
    const reports = await Report.find(filter)
      .populate('pet')
      .populate('owner', 'name email phone')
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'name' }
      })
      .populate('appointment')
      .sort({ createdAt: -1 });
      
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('pet')
      .populate('owner', 'name email phone')
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'name' }
      })
      .populate('appointment');
      
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    // Authorization check
    if (req.user.role === 'pet owner' && report.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to view this report' });
    }
    
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    // Only doctor who created the report can update it
    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ userId: req.user._id });
      if (!doctorProfile || report.doctor.toString() !== doctorProfile._id.toString()) {
        return res.status(403).json({ error: 'Not authorized to update this report' });
      }
    }
    
    const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('pet')
      .populate('owner', 'name email phone')
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'name' }
      });
      
    res.json(updatedReport);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    // Only admin or doctor who created the report can delete it
    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ userId: req.user._id });
      if (!doctorProfile || report.doctor.toString() !== doctorProfile._id.toString()) {
        return res.status(403).json({ error: 'Not authorized to delete this report' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this report' });
    }
    
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generate PDF for a report
exports.generateReportPDF = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('pet')
      .populate('owner', 'name email phone')
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'name' }
      })
      .populate('appointment');
      
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    // Authorization check
    if (req.user.role === 'pet owner' && report.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to view this report' });
    }
    
    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${report._id}.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add header
    doc.fontSize(24).font('Helvetica-Bold').text('Veterinary Medical Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).font('Helvetica').text(`Report ID: ${report._id}`, { align: 'center' });
    doc.text(`Date: ${new Date(report.date).toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);
    
    // Pet Information
    doc.fontSize(16).font('Helvetica-Bold').text('Pet Information');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Name: ${report.pet.name}`);
    doc.text(`Species: ${report.pet.species}`);
    doc.text(`Breed: ${report.pet.breed}`);
    doc.text(`Age: ${report.pet.age} years`);
    if (report.pet.weight) doc.text(`Weight: ${report.pet.weight} kg`);
    doc.moveDown();
    
    // Owner Information
    doc.fontSize(16).font('Helvetica-Bold').text('Owner Information');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Name: ${report.owner.name}`);
    doc.text(`Email: ${report.owner.email}`);
    doc.text(`Phone: ${report.owner.phone}`);
    doc.moveDown();
    
    // Doctor Information
    doc.fontSize(16).font('Helvetica-Bold').text('Doctor Information');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Name: Dr. ${report.doctor.userId.name}`);
    doc.text(`Specialization: ${report.doctor.specialization}`);
    doc.moveDown();
    
    // Medical Details
    doc.fontSize(16).font('Helvetica-Bold').text('Medical Details');
    doc.fontSize(10).font('Helvetica');
    
    if (report.summary) {
      doc.font('Helvetica-Bold').text('Summary:');
      doc.font('Helvetica').text(report.summary, { align: 'justify' });
      doc.moveDown();
    }
    
    if (report.diagnosis) {
      doc.font('Helvetica-Bold').text('Diagnosis:');
      doc.font('Helvetica').text(report.diagnosis, { align: 'justify' });
      doc.moveDown();
    }
    
    if (report.prescription) {
      doc.font('Helvetica-Bold').text('Prescription:');
      doc.font('Helvetica').text(report.prescription, { align: 'justify' });
      doc.moveDown();
    }
    
    // Medications
    if (report.medications && report.medications.length > 0) {
      doc.font('Helvetica-Bold').text('Medications:');
      report.medications.forEach((med, index) => {
        doc.font('Helvetica').text(`${index + 1}. ${med.name} - ${med.dosage} (${med.frequency})`);
        if (med.duration) doc.text(`   Duration: ${med.duration}`);
      });
      doc.moveDown();
    }
    
    // Recommendations
    if (report.recommendations && report.recommendations.length > 0) {
      doc.font('Helvetica-Bold').text('Recommendations:');
      report.recommendations.forEach((rec, index) => {
        doc.font('Helvetica').text(`${index + 1}. ${rec}`);
      });
      doc.moveDown();
    }
    
    if (report.notes) {
      doc.font('Helvetica-Bold').text('Additional Notes:');
      doc.font('Helvetica').text(report.notes, { align: 'justify' });
      doc.moveDown();
    }
    
    // Footer
    doc.moveDown(2);
    doc.fontSize(8).text('This is a computer-generated report.', { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
    
    // Finalize PDF
    doc.end();
    
  } catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get reports for a specific pet
exports.getPetReports = async (req, res) => {
  try {
    const { petId } = req.params;
    
    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    
    // Authorization check
    if (req.user.role === 'pet owner' && pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to view this pet\'s reports' });
    }
    
    const reports = await Report.find({ pet: petId })
      .populate('owner', 'name email phone')
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'name' }
      })
      .populate('appointment')
      .sort({ createdAt: -1 });
      
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};