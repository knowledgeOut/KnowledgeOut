/**
 * 인증 관련 유틸리티 함수
 * 
 * 세션 기반 인증을 사용하므로 localStorage를 사용하지 않습니다.
 * 인증 상태는 백엔드 세션 쿠키(JSESSIONID)로 관리됩니다.
 */

/**
 * 로컬 스토리지에서 사용자 ID 가져오기
 * @deprecated 세션 기반 인증을 사용하므로 더 이상 사용하지 않습니다.
 * 사용자 ID는 백엔드 API에서 가져와야 합니다.
 */
export function getUserId() {
  // 세션 기반 인증이므로 클라이언트에서 사용자 ID를 저장하지 않음
  return null;
}

/**
 * 로컬 스토리지에 사용자 ID 저장
 * @deprecated 세션 기반 인증을 사용하므로 더 이상 사용하지 않습니다.
 */
export function setUserId(userId) {
  // 세션 기반 인증이므로 클라이언트에서 사용자 ID를 저장하지 않음
}

/**
 * 로컬 스토리지에서 사용자 정보 가져오기
 * @deprecated 세션 기반 인증을 사용하므로 더 이상 사용하지 않습니다.
 * 사용자 정보는 백엔드 API에서 가져와야 합니다.
 */
export function getUser() {
  // 세션 기반 인증이므로 클라이언트에서 사용자 정보를 저장하지 않음
  return null;
}

/**
 * 로컬 스토리지에 사용자 정보 저장
 * @deprecated 세션 기반 인증을 사용하므로 더 이상 사용하지 않습니다.
 */
export function setUser(user) {
  // 세션 기반 인증이므로 클라이언트에서 사용자 정보를 저장하지 않음
}

/**
 * 로컬 스토리지에서 인증 토큰 가져오기
 * @deprecated 세션 기반 인증을 사용하므로 더 이상 사용하지 않습니다.
 */
export function getAuthToken() {
  // 세션 기반 인증이므로 클라이언트에서 토큰을 저장하지 않음
  return null;
}

/**
 * 로컬 스토리지에 인증 토큰 저장
 * @deprecated 세션 기반 인증을 사용하므로 더 이상 사용하지 않습니다.
 */
export function setAuthToken(token) {
  // 세션 기반 인증이므로 클라이언트에서 토큰을 저장하지 않음
}

/**
 * 로그아웃 - 모든 인증 정보 제거
 * @deprecated 세션 기반 인증을 사용하므로 더 이상 사용하지 않습니다.
 * 로그아웃은 백엔드 API를 호출하여 처리합니다.
 */
export function clearAuth() {
  // 세션 기반 인증이므로 클라이언트에서 인증 정보를 저장하지 않음
  // 로그아웃은 백엔드 API를 호출하여 세션을 무효화합니다.
}

/**
 * 로그인 여부 확인
 * @deprecated 세션 기반 인증을 사용하므로 더 이상 사용하지 않습니다.
 * 인증 상태는 백엔드 API 호출로 확인해야 합니다.
 * @returns {boolean} 항상 false를 반환합니다. 실제 인증 상태는 백엔드 API로 확인하세요.
 */
export function isAuthenticated() {
  // 세션 기반 인증이므로 클라이언트에서 직접 확인할 수 없음
  // 백엔드 API를 호출하여 인증 상태를 확인해야 합니다.
  return false;
}
