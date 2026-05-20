const express = require('express');
const {
  getLeads,
  getLead,
  createLead,
  updateLeadStatus,
  updateLead,
  deleteLead,
  assignLead,
} = require('../controllers/leadController');
const { authenticate, authorize } = require('../middleware/auth');
const {
  createLeadValidator,
  leadFieldsValidator,
  statusUpdateValidator,
} = require('../validators/leadValidators');

const router = express.Router();

router.use(authenticate);

router.get('/', getLeads);
router.get('/:id', getLead);

router.post('/', authorize('admin'), createLeadValidator, createLead);
router.patch('/:id/status', statusUpdateValidator, updateLeadStatus);
router.patch('/:id/assign', authorize('admin'), assignLead);
router.put('/:id', authorize('admin'), leadFieldsValidator, updateLead);
router.patch('/:id', authorize('admin'), leadFieldsValidator, updateLead);
router.delete('/:id', authorize('admin'), deleteLead);

module.exports = router;
