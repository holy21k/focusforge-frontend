import axiosClient from './axiosClient';

const coachApi = {
  getStatus: () => axiosClient.get('ai/coach/status'),
  getTomorrow: () => axiosClient.get('ai/coach/tomorrow'),
  getFailureRisk: () => axiosClient.get('ai/coach/failure-risk'),
  getWeeklyScore: () => axiosClient.get('ai/coach/weekly-score'),
  getRecommendations: () => axiosClient.get('ai/coach/recommendations'),
  getAllInsights: () => axiosClient.get('ai/coach/insights'),
  getRoast: () => axiosClient.get('ai/coach/roast'),
  getBehavior: () => axiosClient.get('ai/behavior'),
  getProductivityScore: () => axiosClient.get('ai/productivity-score'),
  getInsights: () => axiosClient.get('ai/insights'),
};

export default coachApi;