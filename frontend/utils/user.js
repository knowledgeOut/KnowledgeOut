/**
 * 사용자 관련 유틸리티 함수
 */

/**
 * 탈퇴한 사용자인지 확인합니다.
 * 탈퇴한 사용자의 닉네임은 'deletedUser_'로 시작합니다.
 * 
 * @param {string|null|undefined} nickname - 확인할 닉네임
 * @returns {boolean} 탈퇴한 사용자 여부
 */
export function isDeletedUser(nickname) {
  return !nickname || nickname.startsWith('deletedUser_');
}

/**
 * 사용자 닉네임을 반환합니다.
 * 탈퇴한 사용자인 경우 '탈퇴한 사용자'를 반환합니다.
 * 
 * @param {string|null|undefined} nickname - 사용자 닉네임
 * @returns {string} 표시할 닉네임
 */
export function getUserDisplayName(nickname) {
  return isDeletedUser(nickname) ? '탈퇴한 사용자' : nickname;
}

