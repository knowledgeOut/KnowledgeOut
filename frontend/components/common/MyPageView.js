'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MyPageUserInfoSection } from './MyPageUserInfoSection';
import { MyPageActivityTabs } from './MyPageActivityTabs';
import { getMyQuestions, getMyAnswers, getMyQuestionLikes } from '@/features/member/api';

export function MyPageView({ currentUser, likedQuestionIds, onToggleLike, onLogout, onClose }) {
  const router = useRouter();
  const [myQuestions, setMyQuestions] = useState([]);
  const [myAnswers, setMyAnswers] = useState([]);
  const [myLikedQuestions, setMyLikedQuestions] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [activeTab, setActiveTab] = useState('questions');

  // 마이페이지 표시 시 활동 데이터 조회
  useEffect(() => {
    if (currentUser) {
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
          setMyLikedQuestions(likesData || []);
        } catch (error) {
          console.error('마이페이지 데이터를 불러오는데 실패했습니다:', error);

          // 인증 에러인 경우 마이페이지를 닫고 로그인 상태 초기화
          if (error.message?.includes('로그인') || error.response?.status === 401 || error.response?.status === 403) {
            alert('로그인이 필요합니다. 마이페이지를 닫습니다.');
            if (onClose) {
              onClose();
            }
            return;
          }

          // 기타 에러인 경우 빈 배열로 설정
          setMyQuestions([]);
          setMyAnswers([]);
          setMyLikedQuestions([]);
        } finally {
          setLoadingActivity(false);
        }
      };

      fetchActivityData();
    }
  }, [currentUser, onClose]);

  const handleSelectQuestion = (questionId) => {
    router.push(`/questions/${questionId}`);
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
    }
    // 스크롤을 먼저 초기화
    window.scrollTo(0, 0);
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
    // 라우터 이동
    router.push("/");
    // 라우터 이동 후에도 스크롤 초기화
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          돌아가기
        </Button>

        <MyPageUserInfoSection user={currentUser} onLogout={onLogout} />

        <MyPageActivityTabs
          myQuestions={myQuestions}
          myAnswers={myAnswers}
          likedQuestions={myLikedQuestions}
          loading={loadingActivity}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSelectQuestion={handleSelectQuestion}
          likedQuestionIds={likedQuestionIds}
          onToggleLike={onToggleLike}
        />
      </div>
    </div>
  );
}

