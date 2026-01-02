/**
 * Axios 인스턴스 설정
 * 
 * Note: 현재는 fetch API를 사용하고 있지만,
 * 향후 Axios로 마이그레이션할 경우를 대비한 구조입니다.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/knowledgeout';

/**
 * 기본 fetch 래퍼 함수
 * 향후 Axios로 교체 가능하도록 인터페이스 통일
 */
export const apiClient = {
  /**
   * GET 요청
   */
  async get(url, options = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    });

    if (!response.ok) {
      let errorMessage = '요청에 실패했습니다.';
      try {
        const errorData = await response.json();
        // Spring Boot 기본 에러 응답 형식 처리
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } catch (e) {
        // JSON 파싱 실패 시 상태 코드 기반 메시지
        if (response.status === 400) {
          errorMessage = '잘못된 요청입니다.';
        } else if (response.status === 409) {
          errorMessage = '이미 존재하는 정보입니다.';
        } else if (response.status === 500) {
          errorMessage = '서버 오류가 발생했습니다.';
        }
      }
      const error = new Error(errorMessage);
      error.response = response;
      throw error;
    }

    return response.json();
  },

  /**
   * POST 요청
   */
  async post(url, data = {}, options = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      body: JSON.stringify(data),
      ...options,
    });

    if (!response.ok) {
      let errorMessage = '요청에 실패했습니다.';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          // Spring Boot 기본 에러 응답 형식 처리
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        } else {
          // JSON이 아닌 경우 텍스트로 읽기
          errorMessage = await response.text() || errorMessage;
        }
      } catch (e) {
        // 파싱 실패 시 상태 코드 기반 메시지
        if (response.status === 400) {
          errorMessage = '잘못된 요청입니다.';
        } else if (response.status === 409) {
          errorMessage = '이미 존재하는 정보입니다.';
        } else if (response.status === 500) {
          errorMessage = '서버 오류가 발생했습니다.';
        }
      }
      const error = new Error(errorMessage);
      error.response = response;
      throw error;
    }

    // 성공 응답 처리 - JSON 또는 텍스트
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      // 텍스트 응답인 경우 (예: "회원가입 성공")
      const text = await response.text();
      return text;
    }
  },

  /**
   * PUT 요청
   */
  async put(url, data = {}, options = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      body: JSON.stringify(data),
      ...options,
    });

    if (!response.ok) {
      let errorMessage = '요청에 실패했습니다.';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          // Spring Boot 기본 에러 응답 형식 처리
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        } else {
          // JSON이 아닌 경우 텍스트로 읽기 (백엔드에서 문자열 반환 시)
          errorMessage = await response.text() || errorMessage;
        }
      } catch (e) {
        // JSON 파싱 실패 시 상태 코드 기반 메시지
        if (response.status === 400) {
          errorMessage = '잘못된 요청입니다.';
        } else if (response.status === 409) {
          errorMessage = '이미 존재하는 정보입니다.';
        } else if (response.status === 500) {
          errorMessage = '서버 오류가 발생했습니다.';
        }
      }
      const error = new Error(errorMessage);
      error.response = response;
      throw error;
    }

    // 성공 응답 처리 - JSON 또는 빈 응답
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');

    // 응답 본문이 없는 경우 (Void 응답)
    if (contentLength === '0') {
      return { success: true };
    }

    // 응답 본문 읽기 (한 번만 읽을 수 있음)
    const text = await response.text();

    // 빈 응답인 경우
    if (!text || !text.trim()) {
      return { success: true };
    }

    // JSON 응답인 경우
    if (contentType && contentType.includes('application/json')) {
      try {
        return JSON.parse(text);
      } catch {
        // JSON 파싱 실패 시 텍스트 반환
        return text;
      }
    }

    // 텍스트 응답인 경우
    return text;
  },

  /**
   * DELETE 요청
   */
  async delete(url, options = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    });

    if (!response.ok) {
      let errorMessage = '요청에 실패했습니다.';
      try {
        const errorData = await response.json();
        // Spring Boot 기본 에러 응답 형식 처리
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } catch (e) {
        // JSON 파싱 실패 시 상태 코드 기반 메시지
        if (response.status === 400) {
          errorMessage = '잘못된 요청입니다.';
        } else if (response.status === 409) {
          errorMessage = '이미 존재하는 정보입니다.';
        } else if (response.status === 500) {
          errorMessage = '서버 오류가 발생했습니다.';
        }
      }
      const error = new Error(errorMessage);
      error.response = response;
      throw error;
    }

    // DELETE는 응답 본문이 없을 수 있음
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return { success: true };
  },
};

export default apiClient;

