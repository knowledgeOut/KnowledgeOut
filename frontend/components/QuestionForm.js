"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import { Badge } from './ui/badge';
import { X } from 'lucide-react';

const categories = ['기술', '일반', '기능', '버그', '기타'];

export function QuestionForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('일반');
  const [tags, setTags] = useState([]);

  const extractTagsFromContent = (text) => {
    const tagRegex = /#(\S+)/g;
    const matches = text.match(tagRegex);
    if (!matches) return [];
    return matches.map(tag => tag.substring(1));
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    const extractedTags = extractTagsFromContent(newContent);
    setTags(extractedTags);
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    const updatedContent = content.replace(new RegExp(`#${tagToRemove}\\s*`, 'g'), '');
    setContent(updatedContent);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim() && author.trim()) {
      onSubmit({ title, content, author, category, tags });
      setTitle('');
      setContent('');
      setAuthor('');
      setCategory('일반');
      setTags([]);
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
              onChange={handleContentChange}
              placeholder="질문 내용을 상세히 작성해주세요&#10;&#10;태그를 추가하려면 #태그이름 형식으로 입력하세요 (예: #React #도와주세요)"
              rows={8}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              태그 예시: #Java #Spring #에러해결
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

