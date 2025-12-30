'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const categories = ['기술', '일반', '기능', '버그', '기타'];

export function QuestionForm({ onSubmit, onCancel }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('일반');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim() && content.trim() && author.trim()) {
            onSubmit({ title, content, author, category });
            setTitle('');
            setContent('');
            setAuthor('');
            setCategory('일반');
        }
    };

    return (
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
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="이름을 입력하세요"
                            required
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
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="질문 내용을 상세히 작성해주세요"
                            rows={8}
                            required
                        />
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            취소
                        </Button>
                        <Button type="submit">
                            질문 등록
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

