'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { extractTagsFromContent } from '@/utils/tags';

export function AnswerForm({ onSubmit, currentUser }) {
    const [content, setContent] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);

    // author는 currentUser에서 직접 계산
    const author = currentUser?.nickname || currentUser?.name || '';

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setContent(newContent);

        // 자동으로 태그 추출
        const extractedTags = extractTagsFromContent(newContent);
        setTags(extractedTags);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim() && author.trim()) {
            onSubmit(content, author, tags);
            setContent('');
            // author는 currentUser에서 자동으로 설정되므로 초기화하지 않음
            setTags([]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
        // 내용에서도 해당 태그 제거
        const updatedContent = content.replace(new RegExp(`#${tagToRemove}\\s*`, 'g'), '');
        setContent(updatedContent);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>답변 작성</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="answer-author">작성자</Label>
                        <Input
                            id="answer-author"
                            value={author}
                            disabled
                            placeholder={currentUser ? currentUser.nickname || currentUser.name : "로그인이 필요합니다"}
                            className="bg-gray-100 cursor-not-allowed"
                            required
                        />
                        {!currentUser && (
                            <p className="text-xs text-red-500 mt-1">
                                답변을 작성하려면 로그인이 필요합니다.
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="answer-content">답변 내용</Label>
                        <Textarea
                            id="answer-content"
                            value={content}
                            onChange={handleContentChange}
                            placeholder="답변을 작성해주세요&#10;&#10;태그를 추가하려면 #태그이름 형식으로 입력하세요 (예: #React #JavaScript)"
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

                    <div className="flex justify-end">
                        <Button type="submit" disabled={!currentUser || !author.trim()}>
                            답변 등록
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

