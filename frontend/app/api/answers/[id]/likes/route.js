import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/knowledgeout';

/**
 * POST /api/answers/[id]/likes
 * 답변 추천 API 라우트
 */
export async function POST(request, { params }) {
    try {
        // Next.js 15: params는 Promise이므로 await로 unwrap
        const { id } = await params;

        const response = await fetch(`${API_BASE_URL}/answers/${id}/likes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || '추천에 실패했습니다.' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: '추천 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

