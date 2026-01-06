'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as memberApi from '@/features/member/api';
import { getMyQuestions, getMyAnswers, getMyQuestionLikes } from '@/features/member/api';
import { MyPageUserInfoSection } from '@/components/common/MyPageUserInfoSection';
import { MyPageActivityTabs } from '@/components/common/MyPageActivityTabs';
import { useAuth } from '@/contexts/AuthContext';

export default function MyPagePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 활동 데이터 상태
    const [myQuestions, setMyQuestions] = useState([]);
    const [myAnswers, setMyAnswers] = useState([]);
    const [likedQuestions, setLikedQuestions] = useState([]);
    const [loadingActivity, setLoadingActivity] = useState(true);
    const [activeTab, setActiveTab] = useState('questions');
    
    // 전역 상태에서 추천 목록 가져오기
    const { likedQuestionIds, toggleQuestionLike } = useAuth();

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (user) {
            fetchActivityData();
        }
    }, [user]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const userData = await memberApi.getMyPage();
            setUser(userData);
            setError(null);
        } catch (err) {
            setError(err.message || '마이페이지 정보를 불러올 수 없습니다.');
            // 인증 에러인 경우 로그인 페이지로 리다이렉트
            if (err.message.includes('로그인') || err.response?.status === 401 || err.response?.status === 403) {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchActivityData = async () => {
        try {
            setLoadingActivity(true);
            const [questionsData, answersData, likesData] = await Promise.all([
                getMyQuestions(),
                getMyAnswers(),
                getMyQuestionLikes(),
            ]);
            
            setMyQuestions(questionsData || []);
            setMyAnswers(answersData || []);
            setLikedQuestions(likesData || []);
        } catch (error) {
            console.error('마이페이지 데이터를 불러오는데 실패했습니다:', error);
            
            // 인증 에러인 경우 로그인 페이지로 리다이렉트
            if (error.message?.includes('로그인') || error.response?.status === 401 || error.response?.status === 403) {
                alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
                router.push('/login');
                return;
            }
            
            alert('데이터를 불러오는데 실패했습니다.');
        } finally {
            setLoadingActivity(false);
        }
    };


    const handleBack = () => {
        router.back();
    };

    const handleSelectQuestion = (questionId) => {
        router.push(`/questions/${questionId}`);
    };

    if (loading && !user) {
        return (
            <div className="loading-container">
                <div className="text-gray-600">로딩 중...</div>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="loading-container">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                    <div className="text-red-600 mb-4">{error}</div>
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        로그인하러 가기
                    </button>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="page-container-padded">
            <div className="container-narrow-spaced">
                <Button variant="ghost" onClick={handleBack} className="gap-2 mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    돌아가기
                </Button>

                <MyPageUserInfoSection user={user} />

                <MyPageActivityTabs
                    myQuestions={myQuestions}
                    myAnswers={myAnswers}
                    likedQuestions={likedQuestions}
                    loading={loadingActivity}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onSelectQuestion={handleSelectQuestion}
                    likedQuestionIds={likedQuestionIds}
                    onToggleLike={toggleQuestionLike}
                />
            </div>
        </div>
    );
}