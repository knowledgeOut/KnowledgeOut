/**
 * 답변 관련 API 함수
 */

import apiClient from '../../lib/axios';

/**
 * 답변 목록 조회
 * @param {string|number} questionId - 질문 ID
 * @returns {Promise<Array>} 답변 목록
 */
export async function getAnswers(questionId) {
  try {
    const response = await apiClient.get(`/questions/${questionId}/answers`);
    return response;
  } catch (error) {
    throw new Error(error.message || '답변 목록을 불러올 수 없습니다.');
  }
}

/**
 * 답변 등록
 * @param {string|number} questionId - 질문 ID
 * @param {Object} data - { content }
 * @returns {Promise<Object>} 생성된 답변 정보
 */
export async function createAnswer(questionId, data) {
  try {
    const response = await apiClient.post(`/questions/${questionId}/answers`, data);
    return response;
  } catch (error) {
    throw new Error(error.message || '답변 등록에 실패했습니다.');
  }
}

/**
 * 답변 수정
 * @param {string|number} questionId - 질문 ID
 * @param {string|number} answerId - 답변 ID
 * @param {Object} data - { content }
 * @returns {Promise<Object>} 수정된 답변 정보
 */
export async function updateAnswer(questionId, answerId, data) {
  try {
    const response = await apiClient.put(`/questions/${questionId}/answers/${answerId}`, data);
    return response;
  } catch (error) {
    throw new Error(error.message || '답변 수정에 실패했습니다.');
  }
}

/**
 * 답변 삭제
 * @param {string|number} questionId - 질문 ID
 * @param {string|number} answerId - 답변 ID
 * @returns {Promise<Object>}
 */
export async function deleteAnswer(questionId, answerId) {
  try {
    const response = await apiClient.delete(`/questions/${questionId}/answers/${answerId}`);
    return response;
  } catch (error) {
    throw new Error(error.message || '답변 삭제에 실패했습니다.');
  }
}

/**
 * 답변 추천
 * @param {string|number} id - 답변 ID
 * @returns {Promise<Object>}
 */
export async function likeAnswer(id) {
  try {
    const response = await apiClient.post(`/answers/${id}/likes`);
    return response;
  } catch (error) {
    throw new Error(error.message || '추천에 실패했습니다.');
  }
}

