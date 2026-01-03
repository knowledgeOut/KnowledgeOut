'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, Eye, Tag, Edit, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { AnswerForm } from '@/components/common/AnswerForm';
import { useQuestion } from '@/features/question/hooks';
import { getAnswers, createAnswer, deleteAnswer, updateAnswer } from '@/features/answer/api';
import { getMyPage } from '@/features/member/api';

export default function QuestionDetailPage({ params }) {
    // Next.js 15: params는 Promise이므로 use()로 unwrap
    const { id } = use(params);
    const router = useRouter();
    const { question, loading, error } = useQuestion(id);
    const [currentUser, setCurrentUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loadingAnswers, setLoadingAnswers] = useState(false);
    const [editingAnswerId, setEditingAnswerId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

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

    // 답변 목록 조회
    useEffect(() => {
        const fetchAnswers = async () => {
            if (!id) return;
            try {
                setLoadingAnswers(true);
                const answersData = await getAnswers(id);
                setAnswers(answersData || []);
            } catch (error) {
                console.error('답변 목록 조회 실패:', error);
                setAnswers([]);
            } finally {
                setLoadingAnswers(false);
            }
        };
        fetchAnswers();
    }, [id]);

    // 답변 등록 핸들러
    const handleAddAnswer = async (content, author, tags) => {
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitError(null);
            await createAnswer(id, { content });
            // 답변 목록 새로고침
            const answersData = await getAnswers(id);
            setAnswers(answersData || []);
            // 질문 정보도 다시 불러와서 answerCount 업데이트
            window.location.reload();
        } catch (err) {
            // 인증 오류인 경우 구체적인 메시지 표시
            if (err.response?.status === 401 || err.response?.status === 403) {
                setSubmitError('로그인이 필요합니다. 다시 로그인해주세요.');
            } else {
                setSubmitError(err.message || '답변 등록에 실패했습니다.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // 답변 수정 시작 핸들러
    const handleStartEdit = (answer) => {
        setEditingAnswerId(answer.id);
        setEditingContent(answer.content || '');
    };

    // 답변 수정 취소 핸들러
    const handleCancelEdit = () => {
        setEditingAnswerId(null);
        setEditingContent('');
    };

    // 답변 수정 저장 핸들러
    const handleSaveEdit = async (questionId, answerId) => {
        if (!editingContent.trim()) {
            alert('답변 내용을 입력해주세요.');
            return;
        }

        try {
            setIsUpdating(true);
            await updateAnswer(questionId, answerId, { content: editingContent.trim() });
            // 답변 목록 새로고침
            const answersData = await getAnswers(id);
            setAnswers(answersData || []);
            // 질문 정보도 다시 불러와서 answerCount 업데이트
            window.location.reload();
            setEditingAnswerId(null);
            setEditingContent('');
        } catch (err) {
            alert(err.message || '답변 수정에 실패했습니다.');
        } finally {
            setIsUpdating(false);
        }
    };

    // 답변 삭제 핸들러
    const handleDeleteAnswer = async (questionId, answerId) => {
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (!confirm('정말 이 답변을 삭제하시겠습니까?')) {
            return;
        }

        try {
            await deleteAnswer(questionId, answerId);
            // 답변 목록 새로고침
            const answersData = await getAnswers(id);
            setAnswers(answersData || []);
            // 질문 정보도 다시 불러와서 answerCount 업데이트
            window.location.reload();
        } catch (err) {
            alert(err.message || '답변 삭제에 실패했습니다.');
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
                    <div className="space-y-2">
                        <AnswerForm 
                            onSubmit={handleAddAnswer} 
                            currentUser={currentUser}
                        />
                        {submitError && (
                            <p className="text-sm text-red-500">{submitError}</p>
                        )}
                    </div>

                    {/* 답변 목록 */}
                    {loadingAnswers ? (
                        <div className="text-center py-6 text-gray-500">
                            답변을 불러오는 중...
                        </div>
                    ) : answers.length > 0 ? (
                        <div className="space-y-4">
                            {answers.map((answer) => {
                                // 현재 사용자가 작성한 답변인지 확인
                                // memberId와 currentUser.id를 비교 (타입 변환 고려)
                                const isMyAnswer = currentUser && currentUser.id && answer.memberId && (
                                    Number(answer.memberId) === Number(currentUser.id) ||
                                    String(answer.memberId) === String(currentUser.id)
                                );
                                const isEditing = editingAnswerId === answer.id;

                                return (
                                    <Card key={answer.id}>
                                        <CardContent className="pt-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span>{answer.memberNickname || '익명'}</span>
                                                        <span>{new Date(answer.createdAt).toLocaleString('ko-KR')}</span>
                                                    </div>
                                                    {isMyAnswer && !isEditing && (
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleStartEdit(answer)}
                                                                className="h-8 px-2 text-gray-600 hover:text-gray-900"
                                                            >
                                                                <Edit className="w-4 h-4 mr-1" />
                                                                수정
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteAnswer(id, answer.id)}
                                                                className="h-8 px-2 text-red-600 hover:text-red-700"
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-1" />
                                                                삭제
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {isEditing ? (
                                                    <div className="space-y-3">
                                                        <Textarea
                                                            value={editingContent}
                                                            onChange={(e) => setEditingContent(e.target.value)}
                                                            placeholder="답변 내용을 작성해주세요"
                                                            rows={6}
                                                            className="w-full"
                                                        />
                                                        <div className="flex items-center gap-2 justify-end">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={handleCancelEdit}
                                                                disabled={isUpdating}
                                                                className="h-8 px-3"
                                                            >
                                                                <X className="w-4 h-4 mr-1" />
                                                                취소
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleSaveEdit(id, answer.id)}
                                                                disabled={isUpdating || !editingContent.trim()}
                                                                className="h-8 px-3"
                                                            >
                                                                <Check className="w-4 h-4 mr-1" />
                                                                {isUpdating ? '저장 중...' : '저장'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
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
                                                    </>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-6 text-center text-gray-500">
                                등록된 답변이 없습니다.
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
