/**
 * 애플리케이션 상수 정의
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/knowledgeout';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  MYPAGE: '/mypage',
  QUESTIONS: '/questions',
  QUESTION_NEW: '/questions/new',
  QUESTION_DETAIL: (id) => `/questions/${id}`,
  QUESTION_EDIT: (id) => `/questions/${id}/edit`,
  ANSWER_EDIT: (questionId, answerId) => `/questions/${questionId}/answers/${answerId}/edit`,
  ADMIN_DASHBOARD: '/admin/dashboard',
};

export const STORAGE_KEYS = {
  USER_ID: 'userId',
  AUTH_TOKEN: 'authToken',
  USER: 'user',
};

