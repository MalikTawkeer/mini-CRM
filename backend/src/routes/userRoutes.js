const express = require('express');
const {
  getTeamMembers,
  getUsers,
  createUser,
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const { createUserValidator } = require('../validators/userValidators');

const router = express.Router();

router.get('/team', authenticate, getTeamMembers);
router.get('/', authenticate, authorize('admin'), getUsers);
router.post('/', authenticate, authorize('admin'), createUserValidator, createUser);

module.exports = router;
