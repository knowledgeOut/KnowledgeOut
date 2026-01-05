"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, User as UserIcon, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { QuestionList } from '@/components/common/QuestionList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthDialog } from '@/components/common/AuthDialog';
import { MyPageUserInfoSection } from '@/components/common/MyPageUserInfoSection';
import { MyPageActivityTabs } from '@/components/common/MyPageActivityTabs';
import { getMyPage, getMyQuestions, getMyAnswers, getMyQuestionLikes } from '@/features/member/api';
import { useQuestions } from '@/features/question/hooks';
import { getCategories } from '@/features/category/api';
import { getQuestionCounts } from '@/features/question/api';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedStatus, setSelectedStatus] = useState('전체');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authDialogTab, setAuthDialogTab] = useState('login');
  const [likedQuestionIds, setLikedQuestionIds] = useState(new Set());
  const [currentUser, setCurrentUser] = useState(null);
  const [showMyPage, setShowMyPage] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [counts, setCounts] = useState({ totalCount: 0, pendingCount: 0, answeredCount: 0 });
  const pageSize = 10;

  // 마이페이지 활동 데이터
  const [myQuestions, setMyQuestions] = useState([]);
  const [myAnswers, setMyAnswers] = useState([]);
  const [myLikedQuestions, setMyLikedQuestions] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [activeTab, setActiveTab] = useState('questions');

  // API 파라미터 설정
  const apiParams = {
    page: currentPage,
    size: pageSize,
    search: searchQuery,
    category: selectedCategory,
    status: selectedStatus === 'pending' ? 'WAITING' : (selectedStatus === 'answered' ? 'ANSWERED' : undefined)
  };

  // 질문 목록 조회 훅 사용
  const { questions, loading, error, pageInfo, refetch } = useQuestions(apiParams);

  // 페이지 로드 시 로그인 상태 확인 및 추천 목록 가져오기
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getMyPage();
        setCurrentUser({
          id: userData.id,
          email: userData.email,
          nickname: userData.nickname,
          name: userData.nickname,
          role: userData.role,
        });
        
        // 로그인한 사용자의 추천한 질문 목록 가져오기
        try {
          const likedData = await getMyQuestionLikes();
          const likedIds = new Set((likedData || []).map(q => String(q.id)));
          setLikedQuestionIds(likedIds);
        } catch (error) {
          console.error('추천 목록 조회 실패:', error);
          setLikedQuestionIds(new Set());
        }
      } catch (error) {
        setCurrentUser(null);
        setLikedQuestionIds(new Set());
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // URL 쿼리 파라미터 확인하여 마이페이지 자동 표시
  useEffect(() => {
    const mypage = searchParams?.get('mypage');
    if (mypage === 'true' && currentUser) {
      setShowMyPage(true);
    }
  }, [searchParams, currentUser]);

  // 카테고리 목록 조회
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error('카테고리 조회 실패:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // 전체 개수 조회
  useEffect(() => {
    const fetchCounts = async () => {
      const data = await getQuestionCounts({
        category: selectedCategory,
        search: searchQuery
      });
      setCounts(data);
    };

    fetchCounts();
  }, [selectedCategory, searchQuery]);

  // 마이페이지 표시 시 활동 데이터 조회
  useEffect(() => {
    if (showMyPage && currentUser) {
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
            setShowMyPage(false);
            setCurrentUser(null);
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
  }, [showMyPage, currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleSignup = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      // 백엔드 로그아웃 API 호출 (세션 무효화)
      const { logout } = await import('@/features/auth/api');
      await logout();
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      // 로그아웃 API 에러가 나도 로컬 상태는 초기화
    } finally {
      // 로컬 상태 초기화
      setCurrentUser(null);
      setShowMyPage(false);
      setLikedQuestionIds(new Set());
    }
  };

  // 추천 상태 토글 함수
  const toggleQuestionLike = (questionId) => {
    setLikedQuestionIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(String(questionId))) {
        newSet.delete(String(questionId));
      } else {
        newSet.add(String(questionId));
      }
      return newSet;
    });
  };

  // 카테고리나 검색어 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory, searchQuery, selectedStatus]);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 클라이언트 측 필터링 제거 (백엔드에서 이미 처리됨)
  const filteredQuestions = questions;

  const categoryOptions = ['전체', ...categories.map(c => c.name)];

  // 질문 선택 시 상세 페이지로 이동
  const handleSelectQuestion = (questionId) => {
    router.push(`/questions/${questionId}`);
  };

  // 인증 상태 확인 중이면 로딩 표시
  if (isCheckingAuth) {
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
        <div className="max-w-4xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => {
              setShowMyPage(false);
              router.push("/");
            }}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            돌아가기
          </Button>

          <MyPageUserInfoSection user={currentUser} onLogout={handleLogout} />

          <MyPageActivityTabs
            myQuestions={myQuestions}
            myAnswers={myAnswers}
            likedQuestions={myLikedQuestions}
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6 flex gap-4 flex-wrap items-center">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="질문 검색..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearchQuery(searchInput);
                }
              }}
              className="pl-10"
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => setSearchQuery(searchInput)}
          >
            검색
          </Button>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((cat) => (
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

        {/* 에러 표시 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* 로딩 상태 */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            질문을 불러오는 중...
          </div>
        ) : (
          <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="mb-6">
            <TabsList>
              <TabsTrigger value="전체">
                전체 ({counts.totalCount})
              </TabsTrigger>
              <TabsTrigger value="pending">
                미답변 ({counts.pendingCount})
              </TabsTrigger>
              <TabsTrigger value="answered">
                답변완료 ({counts.answeredCount})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="전체">
              <QuestionList
                questions={filteredQuestions}
                onSelectQuestion={handleSelectQuestion}
                likedQuestionIds={likedQuestionIds}
                onToggleLike={toggleQuestionLike}
              />
            </TabsContent>
            <TabsContent value="pending">
              <QuestionList
                questions={filteredQuestions}
                onSelectQuestion={handleSelectQuestion}
                likedQuestionIds={likedQuestionIds}
                onToggleLike={toggleQuestionLike}
              />
            </TabsContent>
            <TabsContent value="answered">
              <QuestionList
                questions={filteredQuestions}
                onSelectQuestion={handleSelectQuestion}
                likedQuestionIds={likedQuestionIds}
                onToggleLike={toggleQuestionLike}
              />
            </TabsContent>
          </Tabs>
        )}

        {/* 페이지네이션 */}
        {!loading && pageInfo.totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 0) {
                        handlePageChange(currentPage - 1);
                      }
                    }}
                    className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>

                {/* 페이지 번호 표시 */}
                {(() => {
                  const pages = [];
                  const totalPages = pageInfo.totalPages;

                  // 페이지가 7개 이하인 경우 모두 표시
                  if (totalPages <= 7) {
                    for (let i = 0; i < totalPages; i++) {
                      pages.push(
                        <PaginationItem key={i}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(i);
                            }}
                            isActive={i === currentPage}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  } else {
                    // 첫 페이지
                    pages.push(
                      <PaginationItem key={0}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(0);
                          }}
                          isActive={0 === currentPage}
                          className="cursor-pointer"
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    );

                    // 왼쪽 ellipsis
                    if (currentPage > 3) {
                      pages.push(
                        <PaginationItem key="ellipsis-left">
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    // 현재 페이지 주변 페이지들
                    const start = Math.max(1, currentPage - 1);
                    const end = Math.min(totalPages - 2, currentPage + 1);
                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <PaginationItem key={i}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(i);
                            }}
                            isActive={i === currentPage}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    // 오른쪽 ellipsis
                    if (currentPage < totalPages - 4) {
                      pages.push(
                        <PaginationItem key="ellipsis-right">
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    // 마지막 페이지
                    pages.push(
                      <PaginationItem key={totalPages - 1}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(totalPages - 1);
                          }}
                          isActive={totalPages - 1 === currentPage}
                          className="cursor-pointer"
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  return pages;
                })()}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < pageInfo.totalPages - 1) {
                        handlePageChange(currentPage + 1);
                      }
                    }}
                    className={currentPage >= pageInfo.totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* 페이지 정보 표시 */}
        {!loading && pageInfo.totalElements > 0 && (
          <div className="text-center text-sm text-gray-500 mt-4">
            총 {pageInfo.totalElements}개의 질문 (페이지 {currentPage + 1} / {pageInfo.totalPages})
          </div>
        )}
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
