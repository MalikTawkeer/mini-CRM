const Activity = require('../models/Activity');

const logActivity = async ({ type, description, lead, performedBy, metadata = {} }) => {
  await Activity.create({
    type,
    description,
    lead: lead || null,
    performedBy,
    metadata,
  });
};

module.exports = logActivity;
