import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Request interceptor: attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('apexfit_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 unauth
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('apexfit_token');
        localStorage.removeItem('apexfit_user');
      }
    }
    return Promise.reject(error);
  }
);

export default API;

// AUTH APIs
export const loginApi = (credentials) => API.post('/auth/login', credentials);
export const registerApi = (userData) => API.post('/auth/register', userData);
export const getMeApi = () => API.get('/auth/me');
export const forgotPasswordApi = (email) => API.post('/auth/forgot-password', { email });
export const resetPasswordApi = (data) => API.post('/auth/reset-password', data);

// BRANCH APIs
export const getBranchesApi = () => API.get('/branches');
export const createBranchApi = (data) => API.post('/branches', data);

// MEMBERSHIP PLANS
export const getPlansApi = () => API.get('/plans');
export const createPlanApi = (data) => API.post('/plans', data);
export const updatePlanApi = (id, data) => API.put(`/plans/${id}`, data);
export const deletePlanApi = (id) => API.delete(`/plans/${id}`);

// MEMBERS
export const getMembersApi = (params) => API.get('/members', { params });
export const getMemberByIdApi = (id) => API.get(`/members/${id}`);
export const updateMemberApi = (id, data) => API.put(`/members/${id}`, data);
export const deleteMemberApi = (id) => API.delete(`/members/${id}`);

// TRAINERS
export const getTrainersApi = (params) => API.get('/trainers', { params });
export const getTrainerByIdApi = (id) => API.get(`/trainers/${id}`);
export const createTrainerApi = (data) => API.post('/trainers', data);
export const updateTrainerApi = (id, data) => API.put(`/trainers/${id}`, data);
export const deleteTrainerApi = (id) => API.delete(`/trainers/${id}`);

// CLASSES & WAITLIST
export const getClassesApi = (params) => API.get('/classes', { params });
export const createClassApi = (data) => API.post('/classes', data);
export const bookClassApi = (classId) => API.post(`/classes/${classId}/book`);
export const cancelBookingApi = (classId, data) => API.post(`/classes/${classId}/cancel`, data);
export const deleteClassApi = (id) => API.delete(`/classes/${id}`);

// ATTENDANCE & QR
export const getMemberQRApi = () => API.get('/attendance/member-qr');
export const checkInMemberApi = (data) => API.post('/attendance/check-in', data);
export const getAttendanceLogsApi = (params) => API.get('/attendance', { params });

// WORKOUTS
export const getMemberWorkoutApi = (memberId) => API.get(`/workouts/member/${memberId}`);
export const saveWorkoutApi = (data) => API.post('/workouts', data);

// NUTRITION
export const getMemberNutritionApi = (memberId) => API.get(`/nutrition/member/${memberId}`);
export const saveNutritionApi = (data) => API.post('/nutrition', data);

// PROGRESS
export const getProgressHistoryApi = (memberId) => API.get(`/progress/member/${memberId}`);
export const addProgressApi = (data) => API.post('/progress', data);

// LOCKERS
export const getLockersApi = (params) => API.get('/lockers', { params });
export const createLockerApi = (data) => API.post('/lockers', data);
export const assignLockerApi = (id, data) => API.post(`/lockers/${id}/assign`, data);
export const releaseLockerApi = (id) => API.post(`/lockers/${id}/release`);

// PAYMENTS & REFUNDS
export const processPaymentApi = (data) => API.post('/payments/create', data);
export const getPaymentHistoryApi = () => API.get('/payments/history');
export const refundPreviewApi = (data) => API.post('/payments/refund-preview', data);
export const processRefundApi = (data) => API.post('/payments/refund', data);

// NOTIFICATIONS
export const getNotificationsApi = () => API.get('/notifications');
export const markNotificationReadApi = (id) => API.put(`/notifications/${id}/read`);

// ADMIN ANALYTICS & STATS
export const getAdminStatsApi = (params) => API.get('/admin/stats', { params });
export const getAdminAnalyticsApi = () => API.get('/admin/analytics');
