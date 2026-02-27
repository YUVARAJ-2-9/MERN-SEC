const express = require('express');
const router = express.Router();
const {
  addMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
} = require('../controllers/medicineController');
const { protect } = require('../middleware/authMiddleware');

// protect → first token check pannudu, then controller run agum

// POST   /api/medicines       → medicine add pannudu
router.post('/', protect, addMedicine);

// GET    /api/medicines        → all medicines list
router.get('/', protect, getMedicines);

// GET    /api/medicines/:id    → single medicine
router.get('/:id', protect, getMedicineById);

// PUT    /api/medicines/:id    → medicine update
router.put('/:id', protect, updateMedicine);

// DELETE /api/medicines/:id   → medicine delete
router.delete('/:id', protect, deleteMedicine);

module.exports = router;