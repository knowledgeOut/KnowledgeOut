'use client';

import { ArrowLeft, User, FileText, MessageCircle, ThumbsUp, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function MyPage({ user, questions, likedQuestionIds, onBack, onSelectQuestion, onLogout }) {
    // 내가 작성한 질문
    const myQuestions = questions.filter(q => q.author === user.name);

    // 내가 작성한 답변 (질문과 답변 정보 포함)
    const myAnswers = questions.flatMap(q =>
        q.answers
            .filter(a => a.author === user.name)
            .map(a => ({
                answer: a,
                question: q,
            }))
    );

    // 내가 추천한 질문
    const likedQuestions = questions.filter(q => likedQuestionIds.includes(q.id));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    돌아가기
                </Button>
                <Button variant="outline" onClick={onLogout}>
                    로그아웃
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        회원 정보
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="text-gray-500 w-20">이름</span>
                            <span className="font-medium">{user.name}</span>
                        </div>
                        <Separator />
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-500 w-16">이메일</span>
                            <span className="font-medium">{user.email}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="questions" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="questions" className="gap-2">
                        <FileText className="w-4 h-4" />
                        내 질문 ({myQuestions.length})
                    </TabsTrigger>
                    <TabsTrigger value="answers" className="gap-2">
                        <MessageCircle className="w-4 h-4" />
                        내 답변 ({myAnswers.length})
                    </TabsTrigger>
                    <TabsTrigger value="liked" className="gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        추천한 질문
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="questions" className="space-y-4">
                    {myQuestions.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6 text-center text-gray-500">
                                작성한 질문이 없습니다.
                            </CardContent>
                        </Card>
                    ) : (
                        myQuestions.map((question) => (
                            <Card
                                key={question.id}
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => onSelectQuestion(question.id)}
                            >
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant={question.status === 'answered' ? 'default' : 'secondary'}>
                                            {question.status === 'answered' ? '답변완료' : '미답변'}
                                        </Badge>
                                        <Badge variant="outline">{question.category}</Badge>
                                    </div>
                                    <CardTitle className="text-lg">{question.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 line-clamp-2 mb-4">{question.content}</p>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>{new Date(question.createdAt).toLocaleDateString('ko-KR')}</span>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <ThumbsUp className="w-4 h-4" />
                                                <span>{question.likes}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageCircle className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="answers" className="space-y-4">
                    {myAnswers.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6 text-center text-gray-500">
                                작성한 답변이 없습니다.
                            </CardContent>
                        </Card>
                    ) : (
                        myAnswers.map(({ answer, question }, index) => (
                            <Card
                                key={`${question.id}-${answer.id}`}
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => onSelectQuestion(question.id)}
                            >
                                <CardHeader>
                                    <div className="text-sm text-gray-500 mb-2">
                                        답변한 질문: <span className="font-medium text-gray-700">{question.title}</span>
                                    </div>
                                    <CardTitle className="text-base">내 답변</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 whitespace-pre-wrap line-clamp-3 mb-3">{answer.content}</p>
                                    {answer.tags && answer.tags.length > 0 && (
                                        <div className="flex items-center gap-2 flex-wrap mb-3">
                                            {answer.tags.map((tag, tagIndex) => (
                                                <Badge key={tagIndex} variant="secondary">
                                                    #{tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    <div className="text-sm text-gray-500">
                                        {new Date(answer.createdAt).toLocaleString('ko-KR')}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="liked" className="space-y-4">
                    {likedQuestions.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6 text-center text-gray-500">
                                추천한 질문이 없습니다.
                            </CardContent>
                        </Card>
                    ) : (
                        likedQuestions.map((question) => (
                            <Card
                                key={question.id}
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => onSelectQuestion(question.id)}
                            >
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant={question.status === 'answered' ? 'default' : 'secondary'}>
                                            {question.status === 'answered' ? '답변완료' : '미답변'}
                                        </Badge>
                                        <Badge variant="outline">{question.category}</Badge>
                                    </div>
                                    <CardTitle className="text-lg">{question.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 line-clamp-2 mb-4">{question.content}</p>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>{new Date(question.createdAt).toLocaleDateString('ko-KR')}</span>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <ThumbsUp className="w-4 h-4" />
                                                <span>{question.likes}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageCircle className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

