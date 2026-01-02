/**
 * 질문 관련 API 함수
 */

import apiClient from '../../lib/axios';

/**
 * 질문 목록 조회
 * @param {Object} params - { page?, size?, sort?, category?, tag?, status?, search? }
 * @returns {Promise<Object>} Spring Data Page 응답
 */
export async function getQuestions(params = {}) {
  try {
    // Spring Data Pageable 파라미터 변환
    const queryParams = {};
    
    // 페이지 파라미터 (page는 0부터 시작)
    if (params.page !== undefined) {
      queryParams.page = params.page;
    }
    if (params.size !== undefined) {
      queryParams.size = params.size;
    }
    if (params.sort) {
      queryParams.sort = params.sort;
    }
    
    // 검색 파라미터
    if (params.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }
    
    // 필터 파라미터
    if (params.category && params.category !== '전체') {
      queryParams.category = params.category;
    }
    if (params.tag) {
      queryParams.tag = params.tag;
    }
    if (params.status && params.status !== '전체') {
      queryParams.status = params.status;
    }
    
    const queryString = new URLSearchParams(queryParams).toString();
    const url = queryString ? `/questions?${queryString}` : '/questions';
    const response = await apiClient.get(url);
    return response;
  } catch (error) {
    throw new Error(error.message || '질문 목록을 불러올 수 없습니다.');
  }
}

/**
 * 질문 개수 조회 (상태별)
 * @param {Object} params - { category?, search? }
 * @returns {Promise<Object>} { totalCount, pendingCount, answeredCount }
 */
export async function getQuestionCounts(params = {}) {
  try {
    const queryParams = {};
    if (params.category && params.category !== '전체') {
      queryParams.category = params.category;
    }
    if (params.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }
    
    const queryString = new URLSearchParams(queryParams).toString();
    const url = queryString ? `/questions/count-summary?${queryString}` : '/questions/count-summary';
    const response = await apiClient.get(url);
    return response;
  } catch (error) {
    console.error('질문 개수 조회 실패:', error);
    return { totalCount: 0, pendingCount: 0, answeredCount: 0 };
  }
}

/**
 * 질문 상세 조회
 * @param {string|number} id - 질문 ID
 * @returns {Promise<Object>} 질문 상세 정보
 */
export async function getQuestion(id) {
  try {
    const response = await apiClient.get(`/questions/${id}`);
    return response;
  } catch (error) {
    throw new Error(error.message || '질문을 불러올 수 없습니다.');
  }
}

/**
 * 질문 등록
 * @param {Object} data - { title, content, categoryId, tagNames? }
 * @returns {Promise<Long>} 생성된 질문 ID
 */
export async function createQuestion(data) {
  try {
    const response = await apiClient.post('/questions', data);
    return response; // 백엔드에서 Long 타입의 질문 ID를 반환
  } catch (error) {
    throw new Error(error.message || '질문 등록에 실패했습니다.');
  }
}

/**
 * 질문 수정
 * @param {string|number} id - 질문 ID
 * @param {Object} data - { title, content, category?, tags? }
 * @returns {Promise<Object>} 수정된 질문 정보
 */
export async function updateQuestion(id, data) {
  try {
    const response = await apiClient.put(`/questions/${id}`, data);
    return response;
  } catch (error) {
    throw new Error(error.message || '질문 수정에 실패했습니다.');
  }
}

/**
 * 질문 삭제
 * @param {string|number} id - 질문 ID
 * @returns {Promise<Object>}
 */
export async function deleteQuestion(id) {
  try {
    const response = await apiClient.delete(`/questions/${id}`);
    return response;
  } catch (error) {
    throw new Error(error.message || '질문 삭제에 실패했습니다.');
  }
}

/**
 * 질문 추천
 * @param {string|number} id - 질문 ID
 * @returns {Promise<Object>}
 */
export async function likeQuestion(id) {
  try {
    const response = await apiClient.post(`/questions/${id}/likes`);
    return response;
  } catch (error) {
    throw new Error(error.message || '추천에 실패했습니다.');
  }
}

