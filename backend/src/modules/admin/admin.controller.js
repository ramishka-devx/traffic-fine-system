const adminService = require('./admin.service');
const asyncHandler = require('../../common/utils/asyncHandler');

exports.getDashboard = asyncHandler(async (req, res) => {
  const dashboardData = await adminService.getDashboardStats();
  
  res.status(200).json({
    success: true,
    data: dashboardData
  });
});
