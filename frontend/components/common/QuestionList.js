'use client';

import { QuestionCard } from './QuestionCard';

/**
 * 질문 목록 컴포넌트
 * 백엔드 QuestionResponseDto 필드:
 * - id, title, content, viewCount, answerCount, createdAt, modifiedAt
 * - memberId, memberNickname, categoryId, categoryName, tagNames, likeCount
 */
export function QuestionList({ questions, onSelectQuestion }) {
    return (
        <div className="space-y-4">
            {questions.map((question) => (
                <QuestionCard
                    key={question.id}
                    question={question}
                    onSelectQuestion={onSelectQuestion}
                    enableLike={true}
                    showViewCount={true}
                    showMemberName={true}
                    showTags={true}
                />
            ))}
            {questions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    등록된 질문이 없습니다.
                </div>
            )}
        </div>
    );
}

