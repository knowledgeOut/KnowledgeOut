'use client';

import { MessageCircle, Search, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function QuestionList({ questions, onSelectQuestion }) {
    return (
        <div className="space-y-4">
            {questions.map((question) => (
                <Card
                    key={question.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => onSelectQuestion(question.id)}
                >
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant={question.status === 'answered' ? 'default' : 'secondary'}>
                                        {question.status === 'answered' ? '답변완료' : '미답변'}
                                    </Badge>
                                    <Badge variant="outline">{question.category}</Badge>
                                </div>
                                <CardTitle className="text-lg">{question.title}</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 line-clamp-2 mb-4">{question.content}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                                <span>{!question.author || question.author.startsWith('deletedUser_') ? '탈퇴한 사용자' : question.author}</span>
                                <span>{new Date(question.createdAt).toLocaleDateString('ko-KR')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>{question.likes}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{question.answerCount}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
            {questions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    등록된 질문이 없습니다.
                </div>
            )}
        </div>
    );
}

