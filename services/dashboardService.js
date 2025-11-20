import axios from 'axios';

// Fetch admin dashboard summary stats
export const fetchDashboardStats = async () => {
  const response = await axios.get('/api/reports/stats/admin-summary');
  return response.data.stats;
};

// Fetch chart data for reports
export const fetchChartData = async () => {
  const response = await axios.get('/api/reports/stats/chart');
  return response.data.chartData;
};

// Fetch category statistics
export const fetchCategoryStats = async () => {
  const response = await axios.get('/api/reports/stats/category');
  return response.data.categoryStats;
};

// Fetch recent reports
export const fetchRecentReports = async () => {
  const response = await axios.get('/api/reports/stats/recent-reports');
  return response.data.recentReports;
};

// Fetch priority statistics
export const fetchPriorityStats = async () => {
  const response = await axios.get('/api/reports/stats/chart/priority');
  return response.data.priorityStats;
};

// Fetch daily report statistics for a specific month
export const fetchDailyReportStats = async (month) => {
  const response = await axios.get(
    `/api/reports/stats/chart/daily?month=${month}`,
  );
  return response.data.dailyReportStats;
};
