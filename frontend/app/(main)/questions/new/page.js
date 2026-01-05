'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createQuestion } from '@/features/question/api';
import { getCurrentUser } from '@/features/member/api';
import { getCategories } from '@/features/category/api';

export default function NewQuestionPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(null);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        // 로그인한 사용자 정보 가져오기
        const fetchUser = async () => {
            try {
                setLoadingUser(true);
                const userData = await getCurrentUser();
                if (!userData) {
                    alert('로그인이 필요합니다.');
                    router.push('/');
                    return;
                }
                setAuthor(userData.nickname || userData.email || '');
            } catch (error) {
                console.error('사용자 정보를 불러오는데 실패했습니다:', error);
                alert('로그인이 필요합니다.');
                router.push('/');
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
                // 첫 번째 카테고리를 기본값으로 설정
                if (categoryList && categoryList.length > 0) {
                    setCategoryId(categoryList[0].id);
                }
            } catch (error) {
                console.error('카테고리 목록을 불러오는데 실패했습니다:', error);
                alert('카테고리 목록을 불러오는데 실패했습니다.');
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchUser();
        fetchCategories();
    }, [router]);

    const extractTagsFromContent = (text) => {
        const tagRegex = /#(\S+)/g;
        const matches = text.match(tagRegex);
        if (!matches) return [];
        return matches.map(tag => tag.substring(1));
    };

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setContent(newContent);

        // 자동으로 태그 추출
        const extractedTags = extractTagsFromContent(newContent);
        setTags(extractedTags);
    };

    const removeTag = (tagToRemove) => {
        // 태그 목록에서만 제거하고, 내용에는 태그가 그대로 남아있도록 함
        // 이렇게 하면 태그가 내용에 포함된 상태로 저장됨 (답변 작성 화면과 동일한 방식)
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        if (!author) {
            alert('로그인이 필요합니다.');
            router.push('/');
            return;
        }

        if (!categoryId) {
            alert('카테고리를 선택해주세요.');
            return;
        }

        try {
            setLoading(true);
            const questionId = await createQuestion({
                title: title.trim(),
                content: content.trim(), // 태그가 포함된 내용이 그대로 저장됨
                categoryId: categoryId, // 백엔드 API 형식에 맞게 categoryId 사용
                tagNames: tags.length > 0 ? tags : undefined, // 백엔드 API 형식에 맞게 tagNames 사용
            });
            
            // 성공 시 등록한 질문의 상세 화면으로 이동
            router.push(`/questions/${questionId}`);
        } catch (error) {
            alert(error.message || '질문 등록에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>새 질문 작성</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="question-author">작성자</Label>
                                <Input
                                    id="question-author"
                                    value={author}
                                    readOnly
                                    className="bg-gray-100 cursor-not-allowed"
                                    placeholder={loadingUser ? '사용자 정보 로딩 중...' : '이름을 입력하세요'}
                                    disabled={loadingUser}
                                />
                            </div>

                            <div>
                                <Label htmlFor="category">카테고리</Label>
                                <Select 
                                    value={categoryId?.toString() || ''} 
                                    onValueChange={(value) => setCategoryId(Number(value))}
                                    disabled={loadingCategories}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={loadingCategories ? '카테고리 로딩 중...' : '카테고리를 선택하세요'} />
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
                                <Button type="submit" disabled={loading || loadingUser || loadingCategories || !author || !categoryId}>
                                    {loading ? '등록 중...' : '질문 등록'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
