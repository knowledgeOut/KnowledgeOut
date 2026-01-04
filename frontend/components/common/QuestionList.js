'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Eye, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { likeQuestion } from '@/features/question/api';

/**
 * 질문 목록 컴포넌트
 * 백엔드 QuestionResponseDto 필드:
 * - id, title, content, viewCount, answerCount, createdAt, modifiedAt
 * - memberId, memberNickname, categoryId, categoryName, tagNames, likeCount
 */
export function QuestionList({ questions, onSelectQuestion }) {
    // 각 질문의 좋아요 수를 관리하는 상태
    const [likeCounts, setLikeCounts] = useState(() => {
        const counts = {};
        questions.forEach(q => {
            counts[q.id] = q.likeCount || q.like || 0;
        });
        return counts;
    });

    // 각 질문의 좋아요 클릭 상태를 관리하는 상태
    const [likedQuestions, setLikedQuestions] = useState(new Set());

    // questions prop이 변경될 때 likeCounts 업데이트
    useEffect(() => {
        const counts = {};
        questions.forEach(q => {
            counts[q.id] = q.likeCount || q.like || 0;
        });
        setLikeCounts(prev => {
            // 기존 값은 유지하고, 새로운 질문이나 변경된 값만 업데이트
            return { ...prev, ...counts };
        });
    }, [questions]);

    // 답변 상태 계산 (answerCount > 0 이면 답변완료)
    const getStatus = (question) => {
        return question.answerCount > 0 ? 'answered' : 'pending';
    };

    // 추천 버튼 클릭 핸들러
    const handleLikeClick = async (e, questionId) => {
        e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
        
        try {
            const newLikeCount = await likeQuestion(questionId);
            setLikeCounts(prev => ({
                ...prev,
                [questionId]: newLikeCount
            }));
            
            // 좋아요 상태 토글
            setLikedQuestions(prev => {
                const newSet = new Set(prev);
                if (newSet.has(questionId)) {
                    newSet.delete(questionId);
                } else {
                    newSet.add(questionId);
                }
                return newSet;
            });
        } catch (error) {
            console.error('추천 처리 중 오류:', error);
            alert(error.message || '추천 처리에 실패했습니다.');
        }
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
                                <span>{!question.memberNickname || question.memberNickname.startsWith('deletedUser_') ? '탈퇴한 사용자' : question.memberNickname}</span>
                                <span>{new Date(question.createdAt).toLocaleDateString('ko-KR')}</span>
                            </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        <span>{question.viewCount || 0}</span>
                                    </div>
                                    <div 
                                        className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors"
                                        onClick={(e) => handleLikeClick(e, question.id)}
                                    >
                                        <ThumbsUp 
                                            className={`w-4 h-4 ${
                                                likedQuestions.has(question.id) 
                                                    ? 'fill-gray-200' 
                                                    : ''
                                            }`}
                                        />
                                        <span>{likeCounts[question.id] ?? (question.likeCount ?? question.like ?? 0)}</span>
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

