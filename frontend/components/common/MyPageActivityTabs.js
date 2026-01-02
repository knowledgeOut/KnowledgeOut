'use client';

import { useRouter } from 'next/navigation';
import { FileText, MessageCircle, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function MyPageActivityTabs({ 
    myQuestions, 
    myAnswers, 
    likedQuestions, 
    loading, 
    activeTab, 
    onTabChange,
    onSelectQuestion 
}) {
    const router = useRouter();

    const handleQuestionClick = (questionId) => {
        if (onSelectQuestion) {
            onSelectQuestion(questionId);
        } else {
            router.push(`/questions/${questionId}`);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                    데이터를 불러오는 중...
                </CardContent>
            </Card>
        );
    }

    return (
        <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
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
                    추천한 질문 ({likedQuestions.length})
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
                            onClick={() => handleQuestionClick(question.id)}
                        >
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant={question.answerCount > 0 ? 'default' : 'secondary'}>
                                        {question.answerCount > 0 ? '답변완료' : '미답변'}
                                    </Badge>
                                    {question.categoryName && (
                                        <Badge variant="outline">{question.categoryName}</Badge>
                                    )}
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
                                            <span>{question.likeCount || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageCircle className="w-4 h-4" />
                                            <span>{question.answerCount || 0}</span>
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
                    myAnswers.map((answer) => (
                        <Card
                            key={answer.answerId}
                            className="cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => handleQuestionClick(answer.questionId)}
                        >
                            <CardHeader>
                                <div className="text-sm text-gray-500 mb-2">
                                    답변한 질문: <span className="font-medium text-gray-700">{answer.questionTitle}</span>
                                </div>
                                <CardTitle className="text-base">내 답변</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 whitespace-pre-wrap line-clamp-3 mb-3">{answer.content}</p>
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
                            onClick={() => handleQuestionClick(question.id)}
                        >
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant={question.answerCount > 0 ? 'default' : 'secondary'}>
                                        {question.answerCount > 0 ? '답변완료' : '미답변'}
                                    </Badge>
                                    {question.categoryName && (
                                        <Badge variant="outline">{question.categoryName}</Badge>
                                    )}
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
                                            <span>{question.likeCount || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageCircle className="w-4 h-4" />
                                            <span>{question.answerCount || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </TabsContent>
        </Tabs>
    );
}

