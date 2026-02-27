const Medicine = require('../models/Medicine');

// ===== ADD MEDICINE =====
// POST /api/medicines
const addMedicine = async (req, res) => {
  try {
    const { name, dosage, frequency, times, startDate, endDate, notes } = req.body;

    // req.user.userId — middleware set pannidu, yaru login aana nu theriyum
    const medicine = await Medicine.create({
      userId: req.user.userId,
      name,
      dosage,
      frequency,
      times,
      startDate,
      endDate,
      notes,
    });

    res.status(201).json({
      message: 'Medicine added successfully',
      medicine,
    });

  } catch (error) {
    res.status(500).json({ message: 'Error adding medicine', error: error.message });
  }
};

// ===== GET ALL MEDICINES =====
// GET /api/medicines
const getMedicines = async (req, res) => {
  try {
    // Only THIS user's medicines fetch pannudu — other user medicines varadu!
    const medicines = await Medicine.find({
      userId: req.user.userId,
      isActive: true, // Soft deleted medicines varadu
    });

    res.status(200).json(medicines);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching medicines', error: error.message });
  }
};

// ===== GET SINGLE MEDICINE =====
// GET /api/medicines/:id
const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    // Medicine illana
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Someone else's medicine access pannara check
    if (medicine.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json(medicine);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching medicine', error: error.message });
  }
};

// ===== UPDATE MEDICINE =====
// PUT /api/medicines/:id
const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Security — only owner update panna mudiyum
    if (medicine.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update pannudu — new:true means updated document return pannudu
    const updated = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Medicine updated successfully',
      medicine: updated,
    });

  } catch (error) {
    res.status(500).json({ message: 'Error updating medicine', error: error.message });
  }
};

// ===== DELETE MEDICINE =====
// DELETE /api/medicines/:id
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Security — only owner delete panna mudiyum
    if (medicine.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Soft delete — actually delete pannama isActive false pannudu
    // History keep agum!
    await Medicine.findByIdAndUpdate(req.params.id, { isActive: false });

    res.status(200).json({ message: 'Medicine deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Error deleting medicine', error: error.message });
  }
};

module.exports = {
  addMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
};