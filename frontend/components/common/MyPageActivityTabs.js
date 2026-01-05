'use client';

import { useRouter } from 'next/navigation';
import { FileText, MessageCircle, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { QuestionCard } from './QuestionCard';

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
                        <QuestionCard
                            key={question.id}
                            question={question}
                            onSelectQuestion={handleQuestionClick}
                            enableLike={true}
                            showViewCount={true}
                            showMemberName={true}
                            showTags={true}
                        />
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
                        <QuestionCard
                            key={question.id}
                            question={question}
                            onSelectQuestion={handleQuestionClick}
                            enableLike={true}
                            showViewCount={true}
                            showMemberName={true}
                            showTags={true}
                        />
                    ))
                )}
            </TabsContent>
        </Tabs>
    );
}

