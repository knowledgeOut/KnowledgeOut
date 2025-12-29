# API Routes

Next.js API Routes 디렉토리

백엔드 API를 프록시하거나, 서버 사이드에서 직접 처리할 로직이 필요한 경우 사용합니다.

## 구조

```
app/api/
├── members/
│   └── logout/
│       └── route.js          # POST /api/members/logout
├── questions/
│   └── [id]/
│       ├── likes/
│       │   └── route.js      # POST /api/questions/[id]/likes
│       └── answers/
│           └── route.js      # POST/PUT/DELETE /api/questions/[id]/answers
└── answers/
    └── [id]/
        └── likes/
            └── route.js      # POST /api/answers/[id]/likes
```

## 사용 방법

클라이언트 컴포넌트에서 다음과 같이 사용할 수 있습니다:

```javascript
// 로그아웃
await fetch('/api/members/logout', { method: 'POST' });

// 질문 추천
await fetch(`/api/questions/${questionId}/likes`, { method: 'POST' });

// 답변 추천
await fetch(`/api/answers/${answerId}/likes`, { method: 'POST' });

// 답변 등록
await fetch(`/api/questions/${questionId}/answers`, {
  method: 'POST',
  body: JSON.stringify({ content: '답변 내용' })
});

// 답변 수정
await fetch(`/api/questions/${questionId}/answers`, {
  method: 'PUT',
  body: JSON.stringify({ answerId: 1, content: '수정된 답변 내용' })
});

// 답변 삭제
await fetch(`/api/questions/${questionId}/answers?answerId=${answerId}`, {
  method: 'DELETE'
});
```

## 참고

- 모든 API 라우트는 백엔드 API (`/api/knowledgeout`)를 프록시합니다.
- 인증이 필요한 경우 쿠키를 포함하기 위해 `credentials: 'include'`를 사용합니다.
- 환경 변수 `NEXT_PUBLIC_API_BASE_URL`을 통해 백엔드 URL을 설정할 수 있습니다.
