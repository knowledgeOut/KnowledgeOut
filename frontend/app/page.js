"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
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
import { getQuestions, getQuestion } from '@/features/question/api';
import { deleteAnswer, createAnswer } from '@/features/answer/api';

export default function Home() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
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

  // 페이지 로드 시 로그인 상태 확인 및 질문 목록 가져오기
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

  // 질문 목록 가져오기 함수
  const fetchQuestions = useCallback(async () => {
    try {
      setLoadingQuestions(true);
      const data = await getQuestions();
      const questionsList = Array.isArray(data) ? data : data.questions || data.content || [];
      
      // API 응답을 기존 형식에 맞게 변환
      const formattedQuestions = questionsList.map((q) => ({
        id: q.id?.toString() || String(q.id),
        title: q.title || '',
        content: q.content || '',
        author: q.memberNickname || '',
        category: q.categoryName || '',
        createdAt: q.createdAt ? new Date(q.createdAt) : new Date(),
        answerCount: q.answerCount || 0,
        status: (q.answerCount || 0) > 0 ? 'answered' : 'pending',
        likes: q.likeCount || 0,
        answers: [], // 상세 페이지에서 가져올 예정
      }));
      
      setQuestions(formattedQuestions);
    } catch (error) {
      console.error('질문 목록을 불러오는 중 오류가 발생했습니다:', error);
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  }, []);

  // 질문 목록 가져오기
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleSignup = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowMyPage(false);
    setLikedQuestions(new Set());
  };

  const handleAddQuestion = async (newQuestion) => {
    // 질문 작성 후 목록 새로고침
    try {
      await fetchQuestions();
      setShowForm(false);
    } catch (error) {
      console.error('질문 목록을 새로고침하는 중 오류가 발생했습니다:', error);
    }
  };

  const handleAddAnswer = async (questionId, content, author, tags) => {
    try {
      // API를 통해 답변 추가
      await createAnswer(questionId, {
        content: content.trim(),
      });
      
      // 답변 추가 후 질문 상세 정보 새로고침
      await refreshQuestionDetail(questionId);
    } catch (error) {
      alert(error.message || '답변 등록에 실패했습니다.');
      console.error('답변 등록 중 오류가 발생했습니다:', error);
    }
  };

  const handleDeleteAnswer = async (questionId, answerId) => {
    try {
      await deleteAnswer(questionId, answerId);
      // 삭제 후 질문 상세 정보 새로고침
      await refreshQuestionDetail(questionId);
    } catch (error) {
      alert(error.message || '답변 삭제에 실패했습니다.');
      console.error('답변 삭제 중 오류가 발생했습니다:', error);
    }
  };

  const refreshQuestionDetail = useCallback(async (questionId) => {
    try {
      const questionData = await getQuestion(questionId);
      
      // API 응답을 기존 형식에 맞게 변환
      const formattedQuestion = {
        id: questionData.id?.toString() || String(questionData.id),
        title: questionData.title || '',
        content: questionData.content || '',
        author: questionData.memberNickname || '',
        category: questionData.categoryName || '',
        createdAt: questionData.createdAt ? new Date(questionData.createdAt) : new Date(),
        answerCount: questionData.answerCount || 0,
        status: (questionData.answerCount || 0) > 0 ? 'answered' : 'pending',
        likes: questionData.likeCount || 0,
        answers: (questionData.answers || []).map((a) => ({
          id: a.id?.toString() || String(a.id),
          content: a.content || '',
          author: a.memberNickname || '',
          memberId: a.memberId,
          createdAt: a.createdAt ? new Date(a.createdAt) : new Date(),
          tags: a.tagNames || [],
        })),
      };
      
      // 질문 목록 업데이트
      setQuestions(prevQuestions => 
        prevQuestions.map(q => 
          q.id === formattedQuestion.id ? formattedQuestion : q
        )
      );
      
      // 선택된 질문도 업데이트
      if (selectedQuestionId === formattedQuestion.id) {
        setSelectedQuestion(formattedQuestion);
      }
    } catch (error) {
      console.error('질문 상세 정보를 불러오는 중 오류가 발생했습니다:', error);
      throw error;
    }
  }, [selectedQuestionId]);

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

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loadingQuestionDetail, setLoadingQuestionDetail] = useState(false);

  // 질문 상세 정보 가져오기
  useEffect(() => {
    if (selectedQuestionId) {
      const loadQuestionDetail = async () => {
        try {
          setLoadingQuestionDetail(true);
          await refreshQuestionDetail(selectedQuestionId);
        } catch (error) {
          console.error('질문 상세 정보를 불러오는 중 오류가 발생했습니다:', error);
        } finally {
          setLoadingQuestionDetail(false);
        }
      };
      loadQuestionDetail();
    } else {
      setSelectedQuestion(null);
    }
  }, [selectedQuestionId, refreshQuestionDetail]);

  // 질문 목록이 업데이트되면 선택된 질문도 업데이트
  useEffect(() => {
    if (selectedQuestionId) {
      const question = questions.find(q => q.id === selectedQuestionId);
      if (question) {
        setSelectedQuestion(question);
      }
    }
  }, [questions, selectedQuestionId]);

  const categories = ['전체', ...Array.from(new Set(questions.map(q => q.category)))];

  // 인증 상태 확인 중이면 로딩 표시
  if (isCheckingAuth || loadingQuestions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  // 질문 상세 정보 로딩 중
  if (selectedQuestionId && loadingQuestionDetail && !selectedQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">질문 정보를 불러오는 중...</div>
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
            onDeleteAnswer={(questionId, answerId) => handleDeleteAnswer(questionId, answerId)}
            onLike={() => handleLike(selectedQuestion.id)}
            isLiked={likedQuestions.has(selectedQuestion.id)}
            currentUser={currentUser}
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
                    {currentUser.name}님
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
