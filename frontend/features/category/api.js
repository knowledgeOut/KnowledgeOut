/**
 * 카테고리 관련 API 함수
 */

import apiClient from '../../lib/axios';

/**
 * 모든 카테고리 조회
 * @returns {Promise<Array>} 카테고리 목록 [{ id, name }]
 */
export async function getCategories() {
  try {
    const response = await apiClient.get('/categories');
    return response;
  } catch (error) {
    throw new Error(error.message || '카테고리 목록을 불러올 수 없습니다.');
  }
}

