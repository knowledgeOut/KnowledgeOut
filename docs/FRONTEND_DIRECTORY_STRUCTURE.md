# 디렉토리 구조

Next.js App Router를 사용한 하이브리드 구조입니다. Route Groups와 Feature-based 구조를 결합했습니다.

## 전체 구조

```
frontend/
├── app/
│   ├── layout.js                 # 루트 레이아웃
│   ├── page.js                   # 홈 페이지 (질문 게시판)
│   │
│   ├── (auth)/                   # 인증 관련 라우트 그룹
│   │   ├── layout.js             # 인증 전용 레이아웃 (선택사항)
│   │   ├── login/
│   │   │   └── page.js           # POST /members/login
│   │   └── signup/
│   │       └── page.js           # POST /members/signup
│   │
│   ├── (main)/                   # 메인 라우트 그룹
│   │   ├── layout.js             # 메인 전용 레이아웃 (선택사항)
│   │   ├── questions/
│   │   │   ├── page.js           # GET /questions (질문 목록)
│   │   │   ├── new/
│   │   │   │   └── page.js       # POST /questions (질문 등록)
│   │   │   └── [id]/
│   │   │       ├── page.js       # GET /questions/{id} (질문 상세)
│   │   │       ├── edit/
│   │   │       │   └── page.js   # PUT /questions/{id} (질문 수정)
│   │   │       └── answers/
│   │   │           └── [answerId]/
│   │   │               └── edit/
│   │   │                   └── page.js  # PUT /questions/{id}/answers (답변 수정)
│   │   └── mypage/
│   │       └── page.js           # GET /members/mypage
│   │
│   ├── admin/
│   │   └── dashboard/
│   │       └── page.js           # GET /admin/dashboard
│   │
│   └── api/                      # Next.js API Routes (백엔드 프록시)
│       ├── members/
│       │   └── logout/
│       │       └── route.js      # POST /members/logout
│       ├── questions/
│       │   └── [id]/
│       │       ├── likes/
│       │       │   └── route.js  # POST /questions/{id}/likes
│       │       └── answers/
│       │           └── route.js # POST/PUT/DELETE /questions/{id}/answers
│       └── answers/
│           └── [id]/
│               └── likes/
│                   └── route.js  # POST /answers/{id}/likes
│
├── features/                     # Feature-based 구조
│   ├── auth/
│   │   ├── api.js                # 로그인, 회원가입, 로그아웃 API
│   │   ├── hooks.js              # 인증 관련 커스텀 훅
│   │   └── components/           # 인증 관련 컴포넌트 (선택사항)
│   │
│   ├── member/
│   │   ├── api.js                # 마이페이지, 회원 정보 수정 API
│   │   └── components/           # 회원 관련 컴포넌트 (선택사항)
│   │
│   ├── category/
│   │   ├── api.js                # 카테고리 조회 API
│   │   └── components/           # 카테고리 관련 컴포넌트 (선택사항)
│   │
│   ├── question/
│   │   ├── api.js                # 질문 CRUD, 추천 API
│   │   ├── hooks.js              # 질문 관련 커스텀 훅
│   │   └── components/           # 질문 관련 컴포넌트 (선택사항)
│   │
│   ├── answer/
│   │   ├── api.js                # 답변 CRUD, 추천 API
│   │   └── components/           # 답변 관련 컴포넌트 (선택사항)
│   │
│   └── admin/
│       ├── api.js                # 관리자 대시보드 API
│       └── components/           # 관리자 관련 컴포넌트 (선택사항)
│
├── lib/                          # 라이브러리 및 유틸리티
│   ├── axios.js                  # API 클라이언트 (fetch 래퍼)
│   ├── auth.js                   # 인증 관련 유틸리티
│   └── constants.js              # 상수 정의
│
├── components/                   # 재사용 가능한 UI 컴포넌트
│   ├── ui/                       # shadcn/ui 기반 기본 컴포넌트
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   │
│   └── common/                   # 프로젝트 전용 공통 컴포넌트
│       ├── AuthModal.js
│       └── ...
│
└── utils/                        # 유틸리티 함수
    └── date.js                   # 날짜 포맷팅 함수
```

## 라우트 그룹 설명

### (auth) 그룹
인증 관련 페이지를 그룹화합니다. 레이아웃을 공유하지 않으므로 URL에는 표시되지 않습니다.

### (main) 그룹
메인 콘텐츠 페이지를 그룹화합니다. 공통 레이아웃(네비게이션 바, 사이드바 등)을 적용할 수 있습니다.

## Feature-based 구조

각 feature 폴더는 도메인별로 API 함수, 커스텀 훅, 컴포넌트를 포함합니다.

### 사용 예시

```javascript
// API 함수 사용
import * as questionApi from '@/features/question/api';
const questions = await questionApi.getQuestions();

// 커스텀 훅 사용
import { useQuestions } from '@/features/question/hooks';
const { questions, loading, error } = useQuestions();
```

## 백엔드 API 매핑

### 사용자 관련
- `POST /members/signup` → `features/auth/api.js` → `/signup` 페이지
- `POST /members/login` → `features/auth/api.js` → `/login` 페이지
- `POST /members/logout` → `features/auth/api.js` 또는 `/api/members/logout` API 라우트
- `GET /members/mypage` → `features/member/api.js` → `/mypage` 페이지
- `PUT /members/{id}` → `features/member/api.js` → `/mypage` 페이지
- `GET /members/mypage/questions` → `features/member/api.js` → `/mypage` 페이지
- `GET /members/mypage/answers` → `features/member/api.js` → `/mypage` 페이지
- `GET /members/mypage/likes` → `features/member/api.js` → `/mypage` 페이지

### 카테고리 관련
- `GET /categories` → `features/category/api.js` → 질문 작성/수정 페이지

### 질문 관련
- `GET /questions` → `features/question/api.js` → `/questions` 페이지 (페이지네이션, 검색 파라미터: category, tag, status)
- `POST /questions` → `features/question/api.js` → `/questions/new` 페이지
- `GET /questions/{id}` → `features/question/api.js` → `/questions/[id]` 페이지
- `PUT /questions/{id}` → `features/question/api.js` → `/questions/[id]/edit` 페이지
- `DELETE /questions/{id}` → `features/question/api.js` → `/questions/[id]` 페이지에서 처리
- `POST /questions/{id}/likes` → `/api/questions/[id]/likes` API 라우트

### 답변 관련
- `POST /questions/{id}/answers` → `/api/questions/[id]/answers` API 라우트
- `PUT /questions/{id}/answers` → `/api/questions/[id]/answers` API 라우트 → `/questions/[id]/answers/[answerId]/edit` 페이지
- `DELETE /questions/{id}/answers?answerId={answerId}` → `/api/questions/[id]/answers` API 라우트
- `POST /answers/{id}/likes` → `/api/answers/[id]/likes` API 라우트

### 관리자 관련
- `GET /admin/dashboard` → `features/admin/api.js` → `/admin/dashboard` 페이지

## 참고사항

1. **Route Groups**: `(auth)`, `(main)`과 같이 괄호로 감싼 폴더는 URL에 포함되지 않지만, 라우트를 그룹화하는 데 사용됩니다.
2. **Feature-based 구조**: 도메인별로 API, hooks, components를 그룹화하여 코드 응집도를 높입니다.
3. **API 클라이언트**: `lib/axios.js`에서 중앙화된 API 호출을 관리합니다.
4. **인증 관리**: `lib/auth.js`에서 인증 관련 유틸리티를 제공합니다.
