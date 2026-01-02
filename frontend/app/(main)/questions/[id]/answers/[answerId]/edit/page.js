'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { updateAnswer } from '@/features/answer/api';
import { getQuestion } from '@/features/question/api';

export default function EditAnswerPage({ params }) {
    const router = useRouter();
    const { id, answerId } = params;
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingAnswer, setLoadingAnswer] = useState(true);

    useEffect(() => {
        // 질문 상세 정보를 가져와서 답변 찾기
        const fetchAnswer = async () => {
            try {
                setLoadingAnswer(true);
                const question = await getQuestion(id);
                
                // 답변 찾기
                const answer = question.answers?.find(a => a.id === Number(answerId));
                
                if (!answer) {
                    alert('답변을 찾을 수 없습니다.');
                    router.push(`/questions/${id}`);
                    return;
                }

                setContent(answer.content || '');
            } catch (error) {
                console.error('답변 정보를 불러오는데 실패했습니다:', error);
                alert('답변 정보를 불러오는데 실패했습니다.');
                router.push(`/questions/${id}`);
            } finally {
                setLoadingAnswer(false);
            }
        };

        fetchAnswer();
    }, [id, answerId, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!content.trim()) {
            alert('답변 내용을 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            await updateAnswer(id, answerId, {
                content: content.trim(),
            });
            
            // 성공 시 질문 상세 화면으로 이동
            router.push(`/questions/${id}`);
        } catch (error) {
            alert(error.message || '답변 수정에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push(`/questions/${id}`);
    };

    if (loadingAnswer) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center text-gray-600">답변 정보를 불러오는 중...</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>답변 수정</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="answer-content">답변 내용</Label>
                                <Textarea
                                    id="answer-content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="답변 내용을 작성해주세요"
                                    rows={10}
                                    required
                                />
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    취소
                                </Button>
                                <Button type="submit" disabled={loading || !content.trim()}>
                                    {loading ? '수정 중...' : '답변 수정'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
