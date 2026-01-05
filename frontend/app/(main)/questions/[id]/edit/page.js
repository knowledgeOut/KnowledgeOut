"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { X, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getQuestion, updateQuestion } from "@/features/question/api";
import { getCurrentUser } from "@/features/member/api";
import { getCategories } from "@/features/category/api";

export default function EditQuestionPage({ params }) {
  // Next.js 15: params는 Promise이므로 use()로 unwrap
  const { id } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 질문 정보 가져오기
    const fetchQuestion = async () => {
      try {
        setLoadingQuestion(true);
        const questionData = await getQuestion(id);

        // 답변이 있는 경우 수정 불가
        if (questionData.answerCount > 0) {
          setError("답변이 작성된 질문은 수정할 수 없습니다.");
          return;
        }

        setTitle(questionData.title);
        setContent(questionData.content);
        setCategoryId(questionData.categoryId);
        setTags(questionData.tagNames || []);
      } catch (err) {
        setError(err.message || "질문을 불러오는데 실패했습니다.");
      } finally {
        setLoadingQuestion(false);
      }
    };

    // 로그인한 사용자 정보 가져오기
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        const userData = await getCurrentUser();
        if (!userData) {
          setError("로그인이 필요합니다.");
          router.push(`/questions/${id}`);
          return;
        }
      } catch (error) {
        setError("로그인이 필요합니다.");
        router.push(`/questions/${id}`);
        return;
      } finally {
        setLoadingUser(false);
      }
    };

    // 카테고리 목록 가져오기
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoryList = await getCategories();
        setCategories(categoryList);
      } catch (error) {
        console.error("카테고리 목록을 불러오는데 실패했습니다:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchQuestion();
    fetchUser();
    fetchCategories();
  }, [id, router]);

  const extractTagsFromContent = (text) => {
    const tagRegex = /#(\S+)/g;
    const matches = text.match(tagRegex);
    if (!matches) return [];
    return matches.map((tag) => tag.substring(1));
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    // 자동으로 태그 추출
    const extractedTags = extractTagsFromContent(newContent);
    setTags(extractedTags);
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    if (!categoryId) {
      alert("카테고리를 선택해주세요.");
      return;
    }

    try {
      setLoading(true);
      await updateQuestion(id, {
        title: title.trim(),
        content: content.trim(),
        categoryId: categoryId,
        tagNames: tags.length > 0 ? tags : undefined,
      });

      // 성공 시 질문 상세 화면으로 이동
      router.push(`/questions/${id}`);
    } catch (error) {
      alert(error.message || "질문 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/questions/${id}`);
  };

  if (loadingQuestion || loadingUser || loadingCategories) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push(`/questions/${id}`)}
            className="gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            돌아가기
          </Button>
          <div className="text-center py-12 text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={handleCancel} className="gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" />
          돌아가기
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>질문 수정</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="category">카테고리</Label>
                <Select
                  value={categoryId?.toString() || ""}
                  onValueChange={(value) => setCategoryId(Number(value))}
                  disabled={loadingCategories}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingCategories
                          ? "카테고리 로딩 중..."
                          : "카테고리를 선택하세요"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="질문 제목을 입력하세요"
                  required
                />
              </div>

              <div>
                <Label htmlFor="question-content">질문 내용</Label>
                <Textarea
                  id="question-content"
                  value={content}
                  onChange={handleContentChange}
                  placeholder="질문 내용을 상세히 작성해주세요&#10;&#10;태그를 추가하려면 #태그이름 형식으로 입력하세요 (예: #React #JavaScript)"
                  rows={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  태그 예시: #React #TypeScript #버그수정
                </p>
              </div>

              {tags.length > 0 && (
                <div>
                  <Label>태그</Label>
                  <div className="flex items-center gap-2 flex-wrap mt-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  취소
                </Button>
                <Button type="submit" disabled={loading || !categoryId}>
                  {loading ? "수정 중..." : "질문 수정"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
