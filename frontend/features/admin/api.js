/**
 * 관리자 관련 API 함수
 */

import apiClient from '@/lib/axios';

/**
 * 관리자 대시보드 조회
 * @param {number} days - 조회 기간 (예: 1, 7, 30) / 기본값 7
 * @returns {Promise<Object>} 대시보드 통계 정보
 */
export async function getDashboard(days = 7) {
    try {
        const response = await apiClient.get(`/admin/dashboard?days=${days}`);

        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || '대시보드 정보를 불러올 수 없습니다.');
    }
}