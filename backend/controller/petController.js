const Pet = require('../models/Pet');

exports.createPet = async (req, res) => {
  try {
    const petData = {
      ...req.body,
      owner: req.user._id // Add the logged-in user as owner
    };
    const pet = new Pet(petData);
    await pet.save();
    res.status(201).json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPets = async (req, res) => {
  try {
    let query = {};
    
    // If user is pet owner, only show their pets
    if (req.user.role === 'pet owner') {
      query.owner = req.user._id;
    }
    // If user is doctor, show pets they have appointments with
    else if (req.user.role === 'doctor') {
      // This will be handled by appointments
      query = {};
    }
    // If user is admin, show all pets
    else if (req.user.role === 'admin') {
      query = {};
    }
    
    const pets = await Pet.find(query).populate('owner reports');
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('owner reports');
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    
    // Check if user owns this pet (for pet owners) or is admin
    if (req.user.role === 'pet owner' && pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this pet' });
    }
    
    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    
    // Check if user owns this pet (for pet owners) or is admin
    if (req.user.role === 'pet owner' && pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this pet' });
    }
    
    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pet deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPetHistory = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('reports');
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    res.json({
      medical_history: pet.medical_history,
      vaccinationRecords: pet.vaccinationRecords,
      prescriptions: pet.prescriptions,
      allergies: pet.allergies,
      reports: pet.reports
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};