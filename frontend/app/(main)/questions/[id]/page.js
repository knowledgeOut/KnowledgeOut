"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MessageCircle,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  ThumbsUp,
} from "lucide-react";

// UI 구성 요소 (Shadcn UI 기준)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

// 공통 컴포넌트 및 API 기능
import { AnswerForm } from "@/components/common/AnswerForm";
import { useQuestion } from "@/features/question/hooks";
import { deleteQuestion, likeQuestion } from "@/features/question/api";
import {
  getAnswers,
  createAnswer,
  deleteAnswer,
  updateAnswer,
} from "@/features/answer/api";
import { getMyPage, getMyQuestionLikes } from "@/features/member/api";

export default function QuestionDetailPage({ params }) {
  // Next.js 15: params는 Promise이므로 use()를 통해 언래핑
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  // 질문 관련 데이터 (커스텀 훅)
  const { question, loading, error } = useQuestion(id);

  // 로컬 상태 관리
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true); // 인증 확인 중 상태 추가
  const [answers, setAnswers] = useState([]);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [likedQuestionIds, setLikedQuestionIds] = useState(new Set());
  const [likeCount, setLikeCount] = useState(0);

  // 답변 수정 관련 상태
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // 사용자 ID 추출 헬퍼 함수
  const getUserId = (user) => user?.id || user?.memberId;

  // 1. 로그인 사용자 정보 조회 및 추천 목록 가져오기
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsAuthChecking(true);
        const userData = await getMyPage();
        // API 응답 구조에 따라 id 또는 memberId 확인
        if (userData && getUserId(userData)) {
          setCurrentUser(userData);
          
          // 추천한 질문 목록 가져오기
          try {
            const likedData = await getMyQuestionLikes();
            const likedIds = new Set((likedData || []).map(q => String(q.id)));
            setLikedQuestionIds(likedIds);
          } catch (error) {
            console.error('추천 목록 조회 실패:', error);
            setLikedQuestionIds(new Set());
          }
        } else {
          setCurrentUser(null);
          setLikedQuestionIds(new Set());
        }
      } catch (err) {
        console.error("인증 확인 중 오류 발생:", err);
        setCurrentUser(null);
        setLikedQuestionIds(new Set());
      } finally {
        setIsAuthChecking(false);
      }
    };
    checkAuth();
  }, []);

  // 2. 답변 목록을 불러오는 함수
  const fetchAnswers = async () => {
    if (!id) return;
    try {
      setLoadingAnswers(true);
      const answersData = await getAnswers(id);
      setAnswers(answersData || []);
    } catch (err) {
      console.error("답변 목록 조회 실패:", err);
      setAnswers([]);
    } finally {
      setLoadingAnswers(false);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, [id]);

  // 질문 데이터가 로드되면 likeCount 초기화
  useEffect(() => {
    if (question) {
      setLikeCount(question.likeCount || 0);
    }
  }, [question]);

  // 추천 버튼 클릭 핸들러
  const handleLikeClick = async () => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    try {
      const newLikeCount = await likeQuestion(id);
      setLikeCount(newLikeCount);
      
      // 추천 상태 토글
      setLikedQuestionIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(String(id))) {
          newSet.delete(String(id));
        } else {
          newSet.add(String(id));
        }
        return newSet;
      });
    } catch (error) {
      console.error('추천 처리 중 오류:', error);
      alert(error.message || '추천 처리에 실패했습니다.');
    }
  };

  const isLiked = likedQuestionIds.has(String(id));

  /** 질문 수정/삭제 핸들러 */
  const handleEditQuestion = () => router.push(`/questions/${id}/edit`);

  const handleDeleteQuestion = async () => {
    // 관리자가 아닌 경우에만 답변 체크
    if (!isAdmin && question.answerCount > 0) {
      alert("답변이 등록된 질문은 삭제할 수 없습니다.");
      return;
    }
    if (!confirm("정말 이 질문을 삭제하시겠습니까?")) return;

    try {
      await deleteQuestion(id);
      alert("질문이 삭제되었습니다.");
      router.push("/");
    } catch (err) {
      alert(err.message || "삭제에 실패했습니다.");
    }
  };

  /** 답변 등록/수정/삭제 핸들러 */
  const handleAddAnswer = async (content) => {
    // currentUser 상태 재검증
    if (!currentUser || !getUserId(currentUser)) {
      alert("로그인이 필요합니다. 다시 로그인해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await createAnswer(id, { content });
      await fetchAnswers();
      // 전체 카운트 갱신을 위해 페이지 새로고침 (혹은 상태 업데이트)
      window.location.reload();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setSubmitError("세션이 만료되었습니다. 다시 로그인해 주세요.");
      } else {
        setSubmitError(err.message || "답변 등록 중 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEditAnswer = (answer) => {
    setEditingAnswerId(answer.id);
    setEditingContent(answer.content || "");
  };

  const handleSaveEditAnswer = async (answerId) => {
    if (!editingContent.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    try {
      setIsUpdating(true);
      await updateAnswer(id, answerId, { content: editingContent.trim() });
      await fetchAnswers();
      setEditingAnswerId(null);
      setEditingContent("");
    } catch (err) {
      alert(err.message || "수정에 실패했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!confirm("정말 이 답변을 삭제하시겠습니까?")) return;
    try {
      await deleteAnswer(id, answerId);
      await fetchAnswers();
      window.location.reload();
    } catch (err) {
      alert(err.message || "삭제에 실패했습니다.");
    }
  };

  const handleBack = () => router.push("/");

  // 로딩 및 에러 처리 UI
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        질문을 불러오는 중...
      </div>
    );
  if (error || !question)
    return (
      <div className="min-h-screen p-10 text-center space-y-4">
        <p className="text-red-500 font-medium">
          {error || "질문을 찾을 수 없습니다."}
        </p>
        <Button onClick={handleBack}>목록으로 가기</Button>
      </div>
    );

  // 권한 판별 (ID 타입 일치를 위해 String 변환)
  const currentUserId = String(getUserId(currentUser) || "");
  const isQuestionAuthor =
    currentUser && question && currentUserId === String(question.memberId);
  const isAdmin = currentUser?.role === 'ROLE_ADMIN';
  const status = question.answerCount > 0 ? "answered" : "pending";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> 목록으로
        </Button>

        {/* 질문 카드 */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="pb-4 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Badge
                variant={status === "answered" ? "default" : "secondary"}
                className="rounded-md"
              >
                {status === "answered" ? "답변완료" : "미답변"}
              </Badge>
              {question.categoryName && (
                <Badge variant="outline" className="rounded-md">
                  {question.categoryName}
                </Badge>
              )}
              {question.tagNames?.map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs rounded-md"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              {question.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="space-y-6">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex gap-4">
                  <span className="font-semibold text-gray-700">
                    {question.memberNickname}
                  </span>
                  <span>
                    {new Date(question.createdAt).toLocaleString("ko-KR")}
                  </span>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {question.viewCount || 0}
                  </span>
                  <button
                    onClick={handleLikeClick}
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-gray-200' : ''}`} />
                    {likeCount || question.likeCount || 0}
                  </button>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {question.answerCount || 0}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="whitespace-pre-wrap min-h-[150px] leading-relaxed text-gray-800 text-[17px]">
                {question.content}
              </div>

              <div className="pt-4 border-t">
                {question.answerCount === 0 ? (
                  <>
                    {(isQuestionAuthor || isAdmin) ? (
                      <div className="flex justify-end gap-2">
                        {isQuestionAuthor && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEditQuestion}
                            className="gap-2"
                          >
                            <Edit className="w-4 h-4" /> 수정
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDeleteQuestion}
                          className="gap-2 text-red-600 hover:bg-red-50 border-red-100"
                        >
                          <Trash2 className="w-4 h-4" /> 삭제
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        답변이 달린 질문은 수정 및 삭제가 불가합니다.
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    {isAdmin ? (
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDeleteQuestion}
                          className="gap-2 text-red-600 hover:bg-red-50 border-red-100"
                        >
                          <Trash2 className="w-4 h-4" /> 삭제
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        답변이 달린 질문은 수정 및 삭제가 불가합니다.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 답변 영역 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pt-4">
            <MessageCircle className="w-6 h-6 text-indigo-500" />
            <h3 className="text-xl font-bold text-gray-900">
              답변 {question.answerCount || 0}개
            </h3>
          </div>

          {/* 답변 작성 폼 */}
          {isAuthChecking ? (
            <div className="text-sm text-gray-400 py-4 text-center">
              로그인 상태 확인 중...
            </div>
          ) : currentUser ? (
            <div className="space-y-2">
              <AnswerForm
                onSubmit={handleAddAnswer}
                isSubmitting={isSubmitting}
                currentUser={currentUser}
              />
              {submitError && (
                <p className="text-sm text-red-500 font-medium">
                  {submitError}
                </p>
              )}
            </div>
          ) : (
            <Card className="bg-white border-dashed border-2 border-gray-200">
              <CardContent className="py-12 text-center text-gray-500">
                <p className="font-medium">
                  답변을 작성하려면 로그인이 필요합니다.
                </p>
              </CardContent>
            </Card>
          )}

          {/* 답변 목록 */}
          {loadingAnswers ? (
            <div className="text-center py-10 text-gray-400">
              답변 로딩 중...
            </div>
          ) : (
            <div className="space-y-4">
              {answers.length > 0 ? (
                answers.map((answer) => {
                  const answerUid = String(answer.memberId || "");
                  const isMyAnswer =
                    currentUserId && answerUid && currentUserId === answerUid;
                  const isEditing = editingAnswerId === answer.id;

                  return (
                    <Card
                      key={answer.id}
                      className={
                        isMyAnswer
                          ? "border-indigo-100 bg-indigo-50/5 shadow-sm"
                          : "border-none shadow-sm"
                      }
                    >
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3 text-sm">
                            <span className="font-bold text-gray-800">
                              {answer.memberNickname}
                            </span>
                            <span className="text-gray-400">
                              {new Date(answer.createdAt).toLocaleString()}
                            </span>
                            {isMyAnswer && (
                              <Badge
                                variant="outline"
                                className="text-[10px] text-indigo-600 bg-indigo-50 border-indigo-200 h-4"
                              >
                                내 답변
                              </Badge>
                            )}
                          </div>
                          {((isMyAnswer || isAdmin) && !isEditing) && (
                            <div className="flex gap-1">
                              {isMyAnswer && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleStartEditAnswer(answer)}
                                  className="h-8 w-8 text-gray-400 hover:text-indigo-600"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteAnswer(answer.id)}
                                className="h-8 w-8 text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="space-y-3">
                            <Textarea
                              value={editingContent}
                              onChange={(e) =>
                                setEditingContent(e.target.value)
                              }
                              rows={5}
                              className="focus-visible:ring-indigo-500 text-base border-indigo-200"
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingAnswerId(null)}
                              >
                                취소
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleSaveEditAnswer(answer.id)}
                                disabled={isUpdating}
                                className="bg-indigo-600 hover:bg-indigo-700"
                              >
                                <Check className="w-4 h-4 mr-1" />{" "}
                                {isUpdating ? "저장 중..." : "저장"}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-base">
                            {answer.content}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-12 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-lg">
                  아직 등록된 답변이 없습니다.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
