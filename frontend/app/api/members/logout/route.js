import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/knowledgeout';

/**
 * POST /api/members/logout
 * 로그아웃 API 라우트
 */
export async function POST(request) {
    try {
        const response = await fetch(`${API_BASE_URL}/members/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // 쿠키 포함
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || '로그아웃에 실패했습니다.' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: '로그아웃 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

