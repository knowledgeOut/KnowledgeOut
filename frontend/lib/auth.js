/**
 * 인증 관련 유틸리티 함수
 */

import { STORAGE_KEYS } from './constants';

/**
 * 로컬 스토리지에서 사용자 ID 가져오기
 */
export function getUserId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.USER_ID);
}

/**
 * 로컬 스토리지에 사용자 ID 저장
 */
export function setUserId(userId) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
}

/**
 * 로컬 스토리지에서 사용자 정보 가져오기
 */
export function getUser() {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * 로컬 스토리지에 사용자 정보 저장
 */
export function setUser(user) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

/**
 * 로컬 스토리지에서 인증 토큰 가져오기
 */
export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * 로컬 스토리지에 인증 토큰 저장
 */
export function setAuthToken(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
}

/**
 * 로그아웃 - 모든 인증 정보 제거
 */
export function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.USER_ID);
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

/**
 * 로그인 여부 확인
 */
export function isAuthenticated() {
  return !!getUserId();
}

