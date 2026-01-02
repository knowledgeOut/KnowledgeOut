'use client';

import { use } from 'react';

export default function EditAnswerPage({ params }) {
    // Next.js 15: params는 Promise이므로 use()로 unwrap
    const { id, answerId } = use(params);

    return (
        <div>
            <h1>답변 수정</h1>
            <p>질문 ID: {id}</p>
            <p>답변 ID: {answerId}</p>
            {/* TODO: 답변 수정 폼 구현 */}
        </div>
    );
}

