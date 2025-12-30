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
import { getUser } from '@/lib/auth';
import { createQuestion } from '@/features/question/api';

const categories = ['기술', '일반', '기능', '버그', '기타'];

export default function NewQuestionPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('일반');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // 로그인한 사용자 정보 가져오기
        const user = getUser();
        if (user) {
            setAuthor(user.name || user.email || '');
        } else {
            // 로그인하지 않은 경우 홈으로 리다이렉트
            router.push('/');
        }
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
        setTags(tags.filter(tag => tag !== tagToRemove));
        // 내용에서도 해당 태그 제거
        const updatedContent = content.replace(new RegExp(`#${tagToRemove}\\s*`, 'g'), '');
        setContent(updatedContent);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        const user = getUser();
        if (!user) {
            alert('로그인이 필요합니다.');
            router.push('/');
            return;
        }

        try {
            setLoading(true);
            await createQuestion({
                title: title.trim(),
                content: content.trim(),
                category,
                tags: tags.length > 0 ? tags : undefined,
            });
            
            // 성공 시 질문 목록 페이지로 이동
            router.push('/questions');
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
                                <Label htmlFor="author">작성자</Label>
                                <Input
                                    id="author"
                                    value={author}
                                    readOnly
                                    className="bg-gray-100 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <Label htmlFor="category">카테고리</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
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
                                <Label htmlFor="content">내용</Label>
                                <Textarea
                                    id="content"
                                    value={content}
                                    onChange={handleContentChange}
                                    placeholder="질문 내용을 상세히 작성해주세요&#10;&#10;태그를 추가하려면 #태그이름 형식으로 입력하세요 (예: #React #JavaScript)"
                                    rows={8}
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
                                <Button type="submit" disabled={loading}>
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
