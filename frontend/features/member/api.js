/**
 * 회원 관련 API 함수
 * 
 * Spring Security 세션 기반 인증을 사용합니다.
 * 모든 API 호출은 세션 쿠키(JSESSIONID)를 자동으로 전송하며,
 * 백엔드에서 SecurityContext에서 현재 로그인한 사용자 정보를 가져옵니다.
 */

import apiClient from '../../lib/axios';

/**
 * 마이페이지 정보 조회
 * 백엔드에서 SecurityContext에서 현재 로그인한 사용자 정보를 가져옵니다.
 * @returns {Promise<Object>} 사용자 정보
 */
export async function getMyPage() {
  try {
    const response = await apiClient.get('/members/mypage');
    return response;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('로그인이 필요합니다.');
    }
    throw new Error(error.message || '마이페이지 정보를 불러올 수 없습니다.');
  }
}

/**
 * 회원 정보 수정
 * 백엔드에서 SecurityContext에서 현재 로그인한 사용자 정보를 가져옵니다.
 * @param {Object} data - { nickname?, password? }
 * @returns {Promise<Object>} 수정된 사용자 정보
 */
export async function updateMember(data) {
  try {
    // 백엔드 API가 SecurityContext에서 사용자 정보를 가져오므로
    // 사용자 정보를 먼저 가져와서 ID를 사용 (백엔드 API가 path variable을 사용함)
    const currentUser = await getMyPage();
    const response = await apiClient.put(`/members/${currentUser.id}`, data);
    return response;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('로그인이 필요합니다.');
    }
    // axios.js에서 이미 에러 메시지를 error.message에 설정했으므로 그대로 사용
    throw error;
  }
}

/**
 * 내가 작성한 질문 목록 조회
 * 백엔드에서 SecurityContext에서 현재 로그인한 사용자 정보를 가져옵니다.
 * @returns {Promise<Array>} 질문 목록
 */
export async function getMyQuestions() {
  try {
    const response = await apiClient.get('/members/mypage/questions');
    return response;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('로그인이 필요합니다.');
    }
    throw new Error(error.message || '질문 목록을 불러올 수 없습니다.');
  }
}

/**
 * 내가 작성한 답변 목록 조회
 * 백엔드에서 SecurityContext에서 현재 로그인한 사용자 정보를 가져옵니다.
 * @returns {Promise<Array>} 답변 목록
 */
export async function getMyAnswers() {
  try {
    const response = await apiClient.get('/members/mypage/answers');
    return response;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('로그인이 필요합니다.');
    }
    throw new Error(error.message || '답변 목록을 불러올 수 없습니다.');
  }
}

/**
 * 내가 추천한 질문 목록 조회
 * 백엔드에서 SecurityContext에서 현재 로그인한 사용자 정보를 가져옵니다.
 * @returns {Promise<Array>} 추천한 질문 목록
 */
export async function getMyQuestionLikes() {
  try {
    const response = await apiClient.get('/members/mypage/likes');
    return response;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('로그인이 필요합니다.');
    }
    throw new Error(error.message || '추천한 질문 목록을 불러올 수 없습니다.');
  }
}

