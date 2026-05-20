const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

const getLeadFilter = (user) => {
  if (user.role === 'admin') return {};
  return { assignedTo: user._id };
};

const getActivityFilter = (user) => {
  if (user.role === 'admin') return {};
  return { performedBy: user._id };
};

const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const getDashboard = async (req, res, next) => {
  try {
    const filter = getLeadFilter(req.user);

    const [totalLeads, closedLeads, pendingLeads] = await Promise.all([
      Lead.countDocuments(filter),
      Lead.countDocuments({ ...filter, status: 'closed' }),
      Lead.countDocuments({
        ...filter,
        status: { $in: ['new', 'contacted', 'qualified'] },
      }),
    ]);

    res.json({
      stats: {
        totalLeads,
        closedLeads,
        pendingLeads,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getActivities = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const activityFilter = getActivityFilter(req.user);

    const [activities, total] = await Promise.all([
      Activity.find(activityFilter)
        .populate('performedBy', 'name email role')
        .populate('lead', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Activity.countDocuments(activityFilter),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    res.json({
      activities,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard, getActivities };
