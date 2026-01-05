/**
 * 회원 관련 API 함수
 * 
 * Spring Security 세션 기반 인증을 사용합니다.
 * 모든 API 호출은 세션 쿠키(JSESSIONID)를 자동으로 전송하며,
 * 백엔드에서 SecurityContext에서 현재 로그인한 사용자 정보를 가져옵니다.
 */

import apiClient from '../../lib/axios';

/**
 * 현재 로그인한 사용자 정보 조회 (선택적 인증)
 * 로그인하지 않은 경우 null을 반환합니다.
 * 백엔드의 /members/current 엔드포인트를 사용하며, Spring Security에서 사용자 정보를 가져옵니다.
 * @returns {Promise<Object|null>} 사용자 정보 또는 null (미로그인 시)
 */
export async function getCurrentUser() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/knowledgeout'}/members/current`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    // 204 No Content는 로그인하지 않은 경우
    if (response.status === 204) {
      return null;
    }
    
    // 401 Unauthorized도 로그인하지 않은 경우로 처리 (permitAll 설정되어 있어도 혹시 모를 경우 대비)
    if (response.status === 401) {
      return null;
    }
    
    if (!response.ok) {
      // 401이 아닌 다른 에러는 그대로 throw하지 않고 null 반환 (선택적 인증이므로)
      console.error('사용자 정보 조회 실패:', response.status);
      return null;
    }
    
    return response.json();
  } catch (error) {
    // 네트워크 에러 등 기타 에러는 null 반환 (선택적 인증이므로)
    console.error('사용자 정보 조회 중 오류:', error);
    return null;
  }
}

/**
 * 현재 로그인한 사용자의 추천한 질문 목록 조회
 * 백엔드의 /members/mypage/likes 엔드포인트를 사용하며, Spring Security에서 사용자 정보를 가져옵니다.
 * @returns {Promise<Array>} 추천한 질문 목록 (에러 시 빈 배열)
 */
export async function getCurrentUserQuestionLikes() {
  try {
    const response = await apiClient.get('/members/mypage/likes');
    return response || [];
  } catch (error) {
    // 401 또는 403 에러는 로그인하지 않은 것으로 간주하고 빈 배열 반환
    if (error.response?.status === 401 || error.response?.status === 403) {
      return [];
    }
    // 기타 에러도 빈 배열 반환
    console.error('추천한 질문 목록 조회 실패:', error);
    return [];
  }
}

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

/**
 * 회원 탈퇴
 * 백엔드에서 SecurityContext에서 현재 로그인한 사용자 정보를 가져옵니다.
 * @returns {Promise<void>}
 */
export async function withdraw() {
  try {
    const response = await apiClient.delete('/members/mypage/withdraw');
    return response;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('로그인이 필요합니다.');
    }
    if (error.response?.status === 404) {
      throw new Error('회원 탈퇴 API를 찾을 수 없습니다. 백엔드 서버를 확인해주세요.');
    }
    throw new Error(error.message || '회원 탈퇴에 실패했습니다.');
  }
}

