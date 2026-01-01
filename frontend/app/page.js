"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, Plus, User as UserIcon } from 'lucide-react';
import { QuestionList } from '@/components/common/QuestionList';
import { QuestionForm } from '@/components/common/QuestionForm';
import { QuestionDetail } from '@/components/common/QuestionDetail';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthDialog } from '@/components/common/AuthDialog';
import { MyPage } from '@/components/common/MyPage';
import { getMyPage } from '@/features/member/api';
import * as authApi from '@/features/auth/api';

const initialQuestions = [
  {
    id: '1',
    title: 'React에서 useState와 useEffect의 차이점은 무엇인가요?',
    content: 'React Hooks를 공부하고 있는데, useState와 useEffect의 사용 시점과 차이점이 궁금합니다. 각각 언제 사용해야 하나요?',
    author: '김철수',
    category: '기술',
    createdAt: new Date('2024-12-20T10:30:00'),
    answerCount: 2,
    status: 'answered',
    likes: 12,
    answers: [
      {
        id: 'a1',
        content: 'useState는 컴포넌트의 상태를 관리하는 Hook이고, useEffect는 사이드 이펙트를 처리하는 Hook입니다. useState는 상태값과 상태를 업데이트하는 함수를 반환하며, useEffect는 컴포넌트가 렌더링될 때마다 특정 작업을 수행할 수 있게 해줍니다. #React #Hooks',
        author: '이영희',
        createdAt: new Date('2024-12-20T11:00:00'),
        tags: ['React', 'Hooks'],
      },
      {
        id: 'a2',
        content: '추가로 설명하자면, useEffect는 API 호출, 구독 설정, DOM 조작 등의 작업을 할 때 사용합니다. 의존성 배열을 통해 특정 값이 변경될 때만 실행되도록 제어할 수 있습니다. #React #useEffect #성능최적화',
        author: '박민수',
        createdAt: new Date('2024-12-20T14:20:00'),
        tags: ['React', 'useEffect', '성능최적화'],
      },
    ],
  },
  {
    id: '2',
    title: '게시판 검색 기능 구현 방법',
    content: '게시판에 검색 기능을 추가하려고 하는데, 프론트엔드에서 필터링하는 것과 백엔드에서 검색하는 것 중 어느 것이 더 나을까요?',
    author: '정수진',
    category: '기능',
    createdAt: new Date('2024-12-21T09:15:00'),
    answerCount: 1,
    status: 'answered',
    likes: 8,
    answers: [
      {
        id: 'a3',
        content: '데이터의 양에 따라 다릅니다. 적은 양의 데이터라면 프론트엔드에서 필터링해도 무방하지만, 대용량 데이터의 경우 백엔드에서 페이징과 함께 검색 기능을 구현하는 것이 성능상 유리합니다. #성능 #검색',
        author: '최동욱',
        createdAt: new Date('2024-12-21T10:30:00'),
        tags: ['성능', '검색'],
      },
    ],
  },
  {
    id: '3',
    title: 'TypeScript 타입 에러 해결 방법',
    content: 'TypeScript를 사용 중인데 "Type \'string\' is not assignable to type \'number\'" 에러가 계속 발생합니다. 어떻게 해결해야 하나요?',
    author: '강민지',
    category: '버그',
    createdAt: new Date('2024-12-22T15:45:00'),
    answerCount: 0,
    status: 'pending',
    likes: 3,
    answers: [],
  },
  {
    id: '4',
    title: 'CSS Grid와 Flexbox 선택 기준',
    content: '레이아웃을 만들 때 Grid와 Flexbox 중 어떤 것을 선택해야 할지 기준이 궁금합니다.',
    author: '윤서영',
    category: '기술',
    createdAt: new Date('2024-12-23T08:20:00'),
    answerCount: 0,
    status: 'pending',
    likes: 5,
    answers: [],
  },
];

export default function Home() {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedStatus, setSelectedStatus] = useState('전체');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authDialogTab, setAuthDialogTab] = useState('login');
  const [likedQuestions, setLikedQuestions] = useState(new Set());
  const [currentUser, setCurrentUser] = useState(null);
  const [showMyPage, setShowMyPage] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // 페이지 로드 시 로그인 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getMyPage();
        setCurrentUser({
          id: userData.id,
          email: userData.email,
          nickname: userData.nickname,
          name: userData.nickname, // name 필드도 nickname으로 설정
        });
      } catch (error) {
        // 로그인되지 않은 경우 무시
        setCurrentUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleSignup = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      // 백엔드 로그아웃 API 호출 (세션 무효화 및 쿠키 삭제)
      await authApi.logout();
    } catch (error) {
      // 로그아웃 API 에러가 나도 로컬 상태는 초기화
      console.error('로그아웃 중 오류:', error);
    } finally {
      // 로컬 상태 초기화
      setCurrentUser(null);
      setShowMyPage(false);
      setLikedQuestions(new Set());
    }
  };

  const handleAddQuestion = (newQuestion) => {
    const question = {
      id: Date.now().toString(),
      ...newQuestion,
      createdAt: new Date(),
      answerCount: 0,
      status: 'pending',
      answers: [],
      likes: 0,
    };
    setQuestions([question, ...questions]);
    setShowForm(false);
  };

  const handleAddAnswer = (questionId, content, author, tags) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newAnswer = {
          id: Date.now().toString(),
          content,
          author,
          createdAt: new Date(),
          tags,
        };
        return {
          ...q,
          answers: [...q.answers, newAnswer],
          answerCount: q.answers.length + 1,
          status: 'answered',
        };
      }
      return q;
    }));
  };

  const handleLike = (questionId) => {
    const isLiked = likedQuestions.has(questionId);
    
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          likes: isLiked ? q.likes - 1 : q.likes + 1,
        };
      }
      return q;
    }));

    setLikedQuestions(prev => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || q.category === selectedCategory;
    const matchesStatus = selectedStatus === '전체' || q.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const selectedQuestion = selectedQuestionId
    ? questions.find(q => q.id === selectedQuestionId)
    : null;

  const categories = ['전체', ...Array.from(new Set(questions.map(q => q.category)))];

  // 인증 상태 확인 중이면 로딩 표시
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  // 마이페이지 표시
  if (showMyPage && currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <MyPage
            user={currentUser}
            questions={questions}
            likedQuestionIds={Array.from(likedQuestions)}
            onBack={() => setShowMyPage(false)}
            onSelectQuestion={(id) => {
              setShowMyPage(false);
              setSelectedQuestionId(id);
            }}
            onLogout={handleLogout}
          />
        </div>
      </div>
    );
  }

  if (selectedQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <QuestionDetail
            question={selectedQuestion}
            onBack={() => setSelectedQuestionId(null)}
            onAddAnswer={(content, author, tags) => handleAddAnswer(selectedQuestion.id, content, author, tags)}
            onLike={() => handleLike(selectedQuestion.id)}
            isLiked={likedQuestions.has(selectedQuestion.id)}
          />
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <QuestionForm
            onSubmit={handleAddQuestion}
            onCancel={() => setShowForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2">질의응답 게시판</h1>
              <p className="text-gray-600">궁금한 점을 자유롭게 질문하고 답변을 나눠보세요</p>
            </div>
            <div className="flex gap-3">
              {currentUser ? (
                <>
                  <span className="flex items-center gap-2 text-gray-700">
                    <UserIcon className="w-4 h-4" />
                    {(!currentUser.name || currentUser.name.startsWith('deletedUser_') ? '탈퇴한 사용자' : currentUser.name)}님
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setShowMyPage(true)}
                  >
                    마이페이지
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    로그아웃
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setAuthDialogTab('login');
                      setShowAuthDialog(true);
                    }}
                  >
                    로그인
                  </Button>
                  <Button
                    onClick={() => {
                      setAuthDialogTab('signup');
                      setShowAuthDialog(true);
                    }}
                  >
                    회원가입
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6 flex gap-4 flex-wrap items-center">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="질문 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="전체">전체</SelectItem>
              <SelectItem value="pending">미답변</SelectItem>
              <SelectItem value="answered">답변완료</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              if (currentUser) {
                router.push('/questions/new');
              } else {
                setAuthDialogTab('login');
                setShowAuthDialog(true);
              }
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            질문 작성
          </Button>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">
              전체 ({questions.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              미답변 ({questions.filter(q => q.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="answered">
              답변완료 ({questions.filter(q => q.status === 'answered').length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <QuestionList
              questions={filteredQuestions}
              onSelectQuestion={setSelectedQuestionId}
            />
          </TabsContent>
          <TabsContent value="pending">
            <QuestionList
              questions={filteredQuestions.filter(q => q.status === 'pending')}
              onSelectQuestion={setSelectedQuestionId}
            />
          </TabsContent>
          <TabsContent value="answered">
            <QuestionList
              questions={filteredQuestions.filter(q => q.status === 'answered')}
              onSelectQuestion={setSelectedQuestionId}
            />
          </TabsContent>
        </Tabs>
      </div>

      <AuthDialog
        open={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        defaultTab={authDialogTab}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    </div>
  );
}
