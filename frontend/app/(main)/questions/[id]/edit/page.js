'use client';

import { use } from 'react';

export default function EditQuestionPage({ params }) {
    // Next.js 15: params는 Promise이므로 use()로 unwrap
    const { id } = use(params);

    return (
        <div>
            <h1>질문 수정</h1>
            <p>질문 ID: {id}</p>
            {/* TODO: 질문 수정 폼 구현 (답변이 없는 경우만 수정 가능) */}
        </div>
    );
}

