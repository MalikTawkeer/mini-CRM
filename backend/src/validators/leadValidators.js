const { body } = require('express-validator');
const { STATUSES } = require('../models/Lead');

const leadFieldsValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('notes').optional().trim(),
  body('status')
    .optional()
    .isIn(STATUSES)
    .withMessage('Invalid status'),
  body('assignedTo').optional({ nullable: true }),
];

const createLeadValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('notes').optional().trim(),
  body('status')
    .optional()
    .isIn(STATUSES)
    .withMessage('Invalid status'),
  body('assignedTo').optional({ nullable: true }),
];

const statusUpdateValidator = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(STATUSES)
    .withMessage('Invalid status'),
];

module.exports = { leadFieldsValidator, createLeadValidator, statusUpdateValidator };
