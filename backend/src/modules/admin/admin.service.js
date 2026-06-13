const adminRepository = require('./admin.repository');

exports.getDashboardStats = async () => {
  // We can fetch multiple sets of data concurrently to make the API faster
  const [summary, districtData, recentFines] = await Promise.all([
    adminRepository.getDashboardSummary(),
    adminRepository.getFinesByDistrict(),
    adminRepository.getRecentFines()
  ]);

  return {
    summary: {
      total_issued: parseInt(summary.total_fines_issued, 10),
      total_unpaid: parseInt(summary.total_unpaid_fines, 10),
      total_paid: parseInt(summary.total_paid_fines, 10),
      revenue_collected: parseFloat(summary.total_revenue_collected)
    },
    district_breakdown: districtData.map(d => ({
      district: d.district_name,
      fines: parseInt(d.total_fines, 10),
      revenue: parseFloat(d.revenue)
    })),
    recent_activity: recentFines
  };
};
