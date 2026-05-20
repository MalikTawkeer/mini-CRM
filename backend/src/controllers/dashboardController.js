const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

const getLeadFilter = (user) => {
  if (user.role === 'admin') return {};
  return { assignedTo: user._id };
};

const getDashboard = async (req, res, next) => {
  try {
    const filter = getLeadFilter(req.user);

    const activityFilter =
      req.user.role === 'admin'
        ? {}
        : { performedBy: req.user._id };

    const [totalLeads, closedLeads, pendingLeads, recentActivities] =
      await Promise.all([
        Lead.countDocuments(filter),
        Lead.countDocuments({ ...filter, status: 'closed' }),
        Lead.countDocuments({
          ...filter,
          status: { $in: ['new', 'contacted', 'qualified'] },
        }),
        Activity.find(activityFilter)
          .populate('performedBy', 'name email role')
          .populate('lead', 'name')
          .sort({ createdAt: -1 })
          .limit(10),
      ]);

    res.json({
      stats: {
        totalLeads,
        closedLeads,
        pendingLeads,
      },
      recentActivities,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };
