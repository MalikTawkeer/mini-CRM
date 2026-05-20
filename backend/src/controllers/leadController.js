const { validationResult } = require('express-validator');
const Lead = require('../models/Lead');
const User = require('../models/User');
const logActivity = require('../utils/activityLogger');

const populateOptions = [
  { path: 'assignedTo', select: 'name email role' },
  { path: 'createdBy', select: 'name email role' },
];

const getLeadFilter = (user) => {
  if (user.role === 'admin') return {};
  return { assignedTo: user._id };
};

const canAccessLead = (lead, user) => {
  if (user.role === 'admin') return true;
  return lead.assignedTo?.toString() === user._id.toString();
};

const getLeads = async (req, res, next) => {
  try {
    const filter = getLeadFilter(req.user);
    const leads = await Lead.find(filter)
      .populate(populateOptions)
      .sort({ updatedAt: -1 });
    res.json(leads);
  } catch (err) {
    next(err);
  }
};

const getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).populate(populateOptions);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    if (!canAccessLead(lead, req.user)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(lead);
  } catch (err) {
    next(err);
  }
};

const createLead = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, phone, company, notes, status, assignedTo } = req.body;

    if (assignedTo) {
      const assignee = await User.findById(assignedTo);
      if (!assignee || !assignee.isActive) {
        return res.status(400).json({ message: 'Invalid assignee' });
      }
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      notes,
      status: status || 'new',
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
    });

    await lead.populate(populateOptions);

    await logActivity({
      type: 'lead_created',
      description: `Lead "${lead.name}" was created`,
      lead: lead._id,
      performedBy: req.user._id,
    });

    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
};

const updateLeadStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    if (!canAccessLead(lead, req.user)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status } = req.body;
    const previousStatus = lead.status;

    if (status === previousStatus) {
      await lead.populate(populateOptions);
      return res.json(lead);
    }

    lead.status = status;
    await lead.save();
    await lead.populate(populateOptions);

    await logActivity({
      type: 'status_changed',
      description: `Lead "${lead.name}" status changed to ${status}`,
      lead: lead._id,
      performedBy: req.user._id,
      metadata: { from: previousStatus, to: status },
    });

    res.json(lead);
  } catch (err) {
    next(err);
  }
};

const updateLead = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const { name, email, phone, company, notes, status, assignedTo } = req.body;
    const previousStatus = lead.status;
    const previousAssignee = lead.assignedTo?.toString();

    if (assignedTo) {
      const assignee = await User.findById(assignedTo);
      if (!assignee || !assignee.isActive) {
        return res.status(400).json({ message: 'Invalid assignee' });
      }
    }

    if (name !== undefined) lead.name = name;
    if (email !== undefined) lead.email = email;
    if (phone !== undefined) lead.phone = phone;
    if (company !== undefined) lead.company = company;
    if (notes !== undefined) lead.notes = notes;
    if (status !== undefined) lead.status = status;
    if (assignedTo !== undefined) lead.assignedTo = assignedTo || null;

    await lead.save();
    await lead.populate(populateOptions);

    if (status !== undefined && status !== previousStatus) {
      await logActivity({
        type: 'status_changed',
        description: `Lead "${lead.name}" status changed to ${status}`,
        lead: lead._id,
        performedBy: req.user._id,
        metadata: { from: previousStatus, to: status },
      });
    } else if (
      assignedTo !== undefined &&
      lead.assignedTo?.toString() !== previousAssignee
    ) {
      await logActivity({
        type: 'lead_assigned',
        description: `Lead "${lead.name}" was assigned`,
        lead: lead._id,
        performedBy: req.user._id,
        metadata: { assignedTo: lead.assignedTo },
      });
    } else {
      await logActivity({
        type: 'lead_updated',
        description: `Lead "${lead.name}" was updated`,
        lead: lead._id,
        performedBy: req.user._id,
      });
    }

    res.json(lead);
  } catch (err) {
    next(err);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await logActivity({
      type: 'lead_deleted',
      description: `Lead "${lead.name}" was deleted`,
      lead: lead._id,
      performedBy: req.user._id,
    });

    await lead.deleteOne();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const assignLead = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const assignee = assignedTo
      ? await User.findById(assignedTo)
      : null;

    if (assignedTo && (!assignee || !assignee.isActive)) {
      return res.status(400).json({ message: 'Invalid assignee' });
    }

    lead.assignedTo = assignedTo || null;
    await lead.save();
    await lead.populate(populateOptions);

    await logActivity({
      type: 'lead_assigned',
      description: assignee
        ? `Lead "${lead.name}" assigned to ${assignee.name}`
        : `Lead "${lead.name}" unassigned`,
      lead: lead._id,
      performedBy: req.user._id,
      metadata: { assignedTo: lead.assignedTo },
    });

    res.json(lead);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getLeads,
  getLead,
  createLead,
  updateLeadStatus,
  updateLead,
  deleteLead,
  assignLead,
};
