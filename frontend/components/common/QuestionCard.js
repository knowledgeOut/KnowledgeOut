'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Eye, ThumbsUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { likeQuestion } from '@/features/question/api';
import { getUserDisplayName } from '@/utils/user';

/**
 * 질문 카드 컴포넌트
 * @param {Object} question - 질문 객체
 * @param {Function} onSelectQuestion - 질문 클릭 핸들러
 * @param {boolean} enableLike - 좋아요 기능 활성화 여부 (기본값: true)
 * @param {boolean} showViewCount - 조회수 표시 여부 (기본값: true)
 * @param {boolean} showMemberName - 작성자명 표시 여부 (기본값: true)
 * @param {boolean} showTags - 태그 표시 여부 (기본값: true)
 * @param {Set} likedQuestionIds - 추천한 질문 ID Set
 * @param {Function} onToggleLike - 추천 상태 토글 함수
 */
export function QuestionCard({ 
    question, 
    onSelectQuestion,
    enableLike = true,
    showViewCount = true,
    showMemberName = true,
    showTags = true,
    likedQuestionIds = new Set(),
    onToggleLike
}) {
    const [likeCount, setLikeCount] = useState(question.likeCount || question.like || 0);
    
    // likedQuestionIds에서 현재 질문이 추천되었는지 확인
    const isLiked = likedQuestionIds.has(String(question.id));

    // question prop이 변경될 때 likeCount 업데이트
    useEffect(() => {
        setLikeCount(question.likeCount || question.like || 0);
    }, [question]);

    // 답변 상태 계산
    const status = question.answerCount > 0 ? 'answered' : 'pending';

    // 추천 버튼 클릭 핸들러
    const handleLikeClick = async (e) => {
        e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
        
        if (!enableLike) return;
        
        try {
            const newLikeCount = await likeQuestion(question.id);
            setLikeCount(newLikeCount);
            
            // 전역 상태 업데이트
            if (onToggleLike) {
                onToggleLike(question.id);
            }
        } catch (error) {
            console.error('추천 처리 중 오류:', error);
            alert(error.message || '추천 처리에 실패했습니다.');
        }
    };

    const handleCardClick = () => {
        if (onSelectQuestion) {
            onSelectQuestion(question.id);
        }
    };

    return (
        <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleCardClick}
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
                            {showTags && question.tagNames && question.tagNames.map((tag, idx) => (
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
                        {showMemberName && (
                            <span>
                                {getUserDisplayName(question.memberNickname)}
                            </span>
                        )}
                        <span>{new Date(question.createdAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {showViewCount && (
                            <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>{question.viewCount || 0}</span>
                            </div>
                        )}
                        <div 
                            className={`flex items-center gap-1 ${enableLike ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''}`}
                            onClick={enableLike ? handleLikeClick : undefined}
                        >
                            <ThumbsUp 
                                className={`w-4 h-4 ${
                                    enableLike && isLiked 
                                        ? 'fill-gray-200' 
                                        : ''
                                }`}
                            />
                            <span>{likeCount}</span>
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
}

