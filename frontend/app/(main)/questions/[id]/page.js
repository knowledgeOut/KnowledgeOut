'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AnswerForm } from '@/components/common/AnswerForm';
import { useQuestion } from '@/features/question/hooks';
import { createAnswer } from '@/features/answer/api';
import { getMyPage } from '@/features/member/api';

export default function QuestionDetailPage({ params }) {
    // Next.js 15: params는 Promise이므로 use()로 unwrap
    const { id } = use(params);
    const router = useRouter();
    const { question, loading, error } = useQuestion(id);
    const [currentUser, setCurrentUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // 로그인 상태 확인
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await getMyPage();
                setCurrentUser(userData);
            } catch (error) {
                setCurrentUser(null);
            }
        };
        checkAuth();
    }, []);

    // 답변 등록 핸들러
    const handleAddAnswer = async (content) => {
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitError(null);
            await createAnswer(id, { content });
            // 페이지 새로고침으로 답변 목록 갱신
            window.location.reload();
        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 목록으로 돌아가기
    const handleBack = () => {
        router.push('/');
    };

    // 로딩 상태
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-600">질문을 불러오는 중...</div>
            </div>
        );
    }

    // 에러 상태
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <Button variant="ghost" onClick={handleBack} className="gap-2 mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        목록으로
                    </Button>
                    <div className="text-center py-12 text-red-500">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    // 질문이 없는 경우
    if (!question) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <Button variant="ghost" onClick={handleBack} className="gap-2 mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        목록으로
                    </Button>
                    <div className="text-center py-12 text-gray-500">
                        질문을 찾을 수 없습니다.
                    </div>
                </div>
            </div>
        );
    }

    // 상태 계산
    const status = question.answerCount > 0 ? 'answered' : 'pending';

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <Button variant="ghost" onClick={handleBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    목록으로
                </Button>

                {/* 질문 카드 */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-4">
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
                        <CardTitle className="text-2xl">{question.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>{question.memberNickname}</span>
                                    <span>{new Date(question.createdAt).toLocaleString('ko-KR')}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
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
                            <Separator />
                            <div className="whitespace-pre-wrap min-h-[100px]">
                                {question.content}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 답변 섹션 */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        <h3 className="text-lg font-semibold">답변 {question.answerCount || 0}개</h3>
                    </div>

                    {/* 답변 작성 폼 */}
                    {currentUser ? (
                        <div className="space-y-2">
                            <AnswerForm 
                                onSubmit={handleAddAnswer} 
                                isSubmitting={isSubmitting}
                            />
                            {submitError && (
                                <p className="text-sm text-red-500">{submitError}</p>
                            )}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-6 text-center text-gray-500">
                                답변을 작성하려면 로그인이 필요합니다.
                            </CardContent>
                        </Card>
                    )}

                    {/* 답변 목록 안내 */}
                    {question.answerCount > 0 && (
                        <Card>
                            <CardContent className="py-6 text-center text-gray-500">
                                답변 {question.answerCount}개가 등록되어 있습니다.
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
