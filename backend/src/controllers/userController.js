const { validationResult } = require('express-validator');
const User = require('../models/User');
const logActivity = require('../utils/activityLogger');

const getTeamMembers = async (req, res, next) => {
  try {
    const users = await User.find({ isActive: true })
      .select('name email role')
      .sort({ name: 1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('name email role isActive createdAt')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'sales_agent',
    });

    await logActivity({
      type: 'user_created',
      description: `Sales agent "${user.name}" was created`,
      performedBy: req.user._id,
      metadata: { userId: user._id, email: user.email },
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { getTeamMembers, getUsers, createUser };
