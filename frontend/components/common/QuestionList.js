'use client';

import { MessageCircle, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

/**
 * 질문 목록 컴포넌트
 * 백엔드 QuestionResponseDto 필드:
 * - id, title, content, viewCount, answerCount, createdAt, modifiedAt
 * - memberId, memberNickname, categoryId, categoryName, tagNames
 */
export function QuestionList({ questions, onSelectQuestion }) {
    // 답변 상태 계산 (answerCount > 0 이면 답변완료)
    const getStatus = (question) => {
        return question.answerCount > 0 ? 'answered' : 'pending';
    };

    return (
        <div className="space-y-4">
            {questions.map((question) => {
                const status = getStatus(question);
                return (
                    <Card
                        key={question.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => onSelectQuestion(question.id)}
                    >
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant={status === 'answered' ? 'default' : 'secondary'}>
                                            {status === 'answered' ? '답변완료' : '미답변'}
                                        </Badge>
                                        {question.categoryName && (
                                            <Badge variant="outline">{question.categoryName}</Badge>
                                        )}
                                        {question.tagNames && question.tagNames.map((tag, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <CardTitle className="text-lg">{question.title}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 line-clamp-2 mb-4">{question.content}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center gap-4">
                                    <span>{question.memberNickname}</span>
                                    <span>{new Date(question.createdAt).toLocaleDateString('ko-KR')}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        <span>{question.viewCount || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageCircle className="w-4 h-4" />
                                        <span>{question.answerCount || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
            {questions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    등록된 질문이 없습니다.
                </div>
            )}
        </div>
    );
}

