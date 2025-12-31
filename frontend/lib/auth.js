/**
 * 인증 관련 유틸리티 함수
 * 
 * Spring Security 세션 기반 인증을 사용합니다.
 * 인증 상태는 백엔드 세션 쿠키(JSESSIONID)로 관리되며,
 * 클라이언트에서는 사용자 정보를 저장하지 않습니다.
 * 
 * 모든 API 호출은 credentials: 'include' 옵션으로 세션 쿠키를 자동으로 전송합니다.
 */

/**
 * 로그인 상태 확인 (API 호출로 확인)
 * @returns {Promise<boolean>} 로그인 여부
 */
export async function isAuthenticated() {
  // 세션 기반 인증이므로 클라이언트에서 직접 확인할 수 없음
  // 백엔드 API를 호출하여 인증 상태를 확인해야 합니다.
  // 마이페이지 API 호출로 인증 상태 확인 가능
  return false; // 실제로는 API 호출 결과로 판단
}

/**
 * 로그인 여부 확인 (동기 함수, deprecated)
 * @deprecated 세션 기반 인증을 사용하므로 더 이상 사용하지 않습니다.
 * @returns {boolean} 항상 false를 반환합니다.
 */
export function isAuthenticatedSync() {
  return false;
}

/**
 * 로컬 스토리지에서 사용자 정보 가져오기
 * @deprecated 세션 기반 인증을 사용하므로 더 이상 사용하지 않습니다.
 * 사용자 정보는 백엔드 API에서 가져와야 합니다.
 * @returns {null} 항상 null을 반환합니다.
 */
export function getCurrentUser() {
  // 세션 기반 인증이므로 클라이언트에서 사용자 정보를 저장하지 않음
  return null;
}

/**
 * 로컬 스토리지에 사용자 정보 저장
 * @deprecated 세션 기반 인증을 사용하므로 더 이상 사용하지 않습니다.
 */
export function setCurrentUser(user) {
  // 세션 기반 인증이므로 클라이언트에서 사용자 정보를 저장하지 않음
}

/**
 * 로컬 스토리지에서 사용자 정보 제거
 * @deprecated 세션 기반 인증을 사용하므로 더 이상 사용하지 않습니다.
 */
export function clearCurrentUser() {
  // 세션 기반 인증이므로 클라이언트에서 사용자 정보를 저장하지 않음
}

/**
 * 로컬 스토리지에서 사용자 ID 가져오기
 * @deprecated 세션 기반 인증을 사용하므로 더 이상 사용하지 않습니다.
 * @returns {null} 항상 null을 반환합니다.
 */
export function getUserId() {
  return null;
}

/**
 * 로컬 스토리지에 사용자 ID 저장
 * @deprecated 세션 기반 인증을 사용하므로 더 이상 사용하지 않습니다.
 */
export function setUserId(userId) {
  // 사용하지 않음
}

/**
 * 로컬 스토리지에서 사용자 정보 가져오기
 * @deprecated 세션 기반 인증을 사용하므로 더 이상 사용하지 않습니다.
 * @returns {null} 항상 null을 반환합니다.
 */
export function getUser() {
  return null;
}

/**
 * 로컬 스토리지에 사용자 정보 저장
 * @deprecated 세션 기반 인증을 사용하므로 더 이상 사용하지 않습니다.
 */
export function setUser(user) {
  // 사용하지 않음
}

/**
 * 로그아웃 - 모든 인증 정보 제거
 * @deprecated 세션 기반 인증을 사용하므로 더 이상 사용하지 않습니다.
 * 로그아웃은 백엔드 API를 호출하여 세션을 무효화합니다.
 */
export function clearAuth() {
  // 세션 기반 인증이므로 클라이언트에서 인증 정보를 저장하지 않음
  // 로그아웃은 백엔드 API를 호출하여 세션을 무효화합니다.
}