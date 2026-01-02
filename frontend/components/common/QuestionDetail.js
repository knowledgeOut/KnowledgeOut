'use client';

import { ArrowLeft, MessageCircle, Tag, ThumbsUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { AnswerForm } from './AnswerForm';

export function QuestionDetail({ question, onBack, onAddAnswer, onLike, isLiked, currentUser }) {
    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={onBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                목록으로
            </Button>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2 mb-4">
                        <Badge variant={question.status === 'answered' ? 'default' : 'secondary'}>
                            {question.status === 'answered' ? '답변완료' : '미답변'}
                        </Badge>
                        <Badge variant="outline">{question.category}</Badge>
                    </div>
                    <CardTitle className="text-2xl">{question.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{question.author}</span>
                                <span>{new Date(question.createdAt).toLocaleString('ko-KR')}</span>
                            </div>
                            <Button
                                variant={isLiked ? 'default' : 'outline'}
                                size="sm"
                                onClick={onLike}
                                className="gap-2"
                            >
                                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                                <span>추천 {question.likes}</span>
                            </Button>
                        </div>
                        <Separator />
                        <div className="whitespace-pre-wrap">{question.content}</div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    <h3 className="text-lg">답변 {question.answers.length}개</h3>
                </div>

                <AnswerForm onSubmit={onAddAnswer} currentUser={currentUser} />

                {question.answers.map((answer) => (
                    <Card key={answer.id}>
                        <CardContent className="pt-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>{answer.author}</span>
                                    <span>{new Date(answer.createdAt).toLocaleString('ko-KR')}</span>
                                </div>
                                <div className="whitespace-pre-wrap">{answer.content}</div>
                                {answer.tags && answer.tags.length > 0 && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Tag className="w-4 h-4 text-gray-400" />
                                        {answer.tags.map((tag, index) => (
                                            <Badge key={index} variant="secondary" className="gap-1">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

