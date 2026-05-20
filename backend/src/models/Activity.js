const mongoose = require('mongoose');

const ACTIVITY_TYPES = [
  'lead_created',
  'lead_updated',
  'lead_deleted',
  'lead_assigned',
  'status_changed',
  'user_login',
  'user_created',
];

const activitySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ACTIVITY_TYPES, required: true },
    description: { type: String, required: true },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', default: null },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
module.exports.ACTIVITY_TYPES = ACTIVITY_TYPES;
