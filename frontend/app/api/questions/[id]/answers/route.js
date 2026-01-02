import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/knowledgeout';

/**
 * POST /api/questions/[id]/answers
 * 답변 등록 API 라우트
 */
export async function POST(request, { params }) {
    try {
        // Next.js 15: params는 Promise이므로 await로 unwrap
        const { id } = await params;
        const body = await request.json();

        const response = await fetch(`${API_BASE_URL}/questions/${id}/answers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || '답변 등록에 실패했습니다.' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: '답변 등록 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/questions/[id]/answers
 * 답변 수정 API 라우트
 */
export async function PUT(request, { params }) {
    try {
        // Next.js 15: params는 Promise이므로 await로 unwrap
        const { id } = await params;
        const body = await request.json();

        const response = await fetch(`${API_BASE_URL}/questions/${id}/answers`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || '답변 수정에 실패했습니다.' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: '답변 수정 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/questions/[id]/answers
 * 답변 삭제 API 라우트
 */
export async function DELETE(request, { params }) {
    try {
        // Next.js 15: params는 Promise이므로 await로 unwrap
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const answerId = searchParams.get('answerId');

        if (!answerId) {
            return NextResponse.json(
                { error: '답변 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const response = await fetch(`${API_BASE_URL}/questions/${id}/answers?answerId=${answerId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: data.message || '답변 삭제에 실패했습니다.' },
                { status: response.status }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: '답변 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

