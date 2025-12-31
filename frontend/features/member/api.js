/**
 * 회원 관련 API 함수
 */

import apiClient from '../../lib/axios';

/**
 * 마이페이지 정보 조회
 * @param {number} userId - 사용자 ID (세션 기반 인증이므로 나중에 백엔드에서 가져올 예정)
 * @returns {Promise<Object>} 사용자 정보
 */
export async function getMyPage(userId) {
  try {
    if (!userId) {
      throw new Error('로그인이 필요합니다.');
    }
    
    const response = await apiClient.get(`/members/mypage?id=${userId}`);
    return response;
  } catch (error) {
    throw new Error(error.message || '마이페이지 정보를 불러올 수 없습니다.');
  }
}

/**
 * 회원 정보 수정
 * @param {number} userId - 사용자 ID (세션 기반 인증이므로 나중에 백엔드에서 가져올 예정)
 * @param {Object} data - { nickname?, password? }
 * @returns {Promise<Object>} 수정된 사용자 정보
 */
export async function updateMember(userId, data) {
  try {
    if (!userId) {
      throw new Error('로그인이 필요합니다.');
    }
    
    const response = await apiClient.put(`/members/${userId}`, data);
    return response;
  } catch (error) {
    throw new Error(error.message || '회원 정보 수정에 실패했습니다.');
  }
}

