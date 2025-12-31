/**
 * 인증 관련 API 함수
 */

import apiClient from '../../lib/axios';

/**
 * 회원가입
 * @param {Object} data - { email, password, nickname }
 * @returns {Promise<Object>} 성공 메시지
 */
export async function signup(data) {
  try {
    const response = await apiClient.post('/members/signup', data);
    // 백엔드는 "회원가입 성공" 문자열을 반환하므로 그대로 반환
    return response;
  } catch (error) {
    // 백엔드 에러 메시지 추출
    let errorMessage = '회원가입에 실패했습니다.';
    
    if (error.message) {
      errorMessage = error.message;
    } else if (error.response) {
      // fetch API를 사용하므로 response 객체가 다를 수 있음
      try {
        const errorData = await error.response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // JSON 파싱 실패 시 기본 메시지 사용
        // 백엔드에서 문자열로 에러를 반환할 수도 있음
        if (error.response.status === 400) {
          errorMessage = '잘못된 요청입니다.';
        } else if (error.response.status === 409) {
          errorMessage = '이미 존재하는 정보입니다.';
        }
      }
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * 로그인
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} 로그인 응답 { status, message }
 */
export async function login(credentials) {
  try {
    const response = await apiClient.post('/members/login', credentials);
    // 백엔드는 세션 기반 인증을 사용하므로 쿠키에 JSESSIONID가 저장됨
    // 응답: { status: "Success", message: "로그인이 완료되었습니다." }
    return response;
  } catch (error) {
    throw new Error(error.message || '로그인에 실패했습니다.');
  }
}

/**
 * 로그아웃
 * @returns {Promise<Object>}
 */
export async function logout() {
  try {
    await apiClient.post('/members/logout');
    // 세션 기반이므로 서버에서 세션 무효화 및 쿠키 삭제
    return { success: true };
  } catch (error) {
    throw new Error(error.message || '로그아웃에 실패했습니다.');
  }
}

