# Features

Feature-based 구조로 도메인별로 API, hooks, components를 그룹화합니다.

## 구조

```
features/
├── auth/              # 인증 관련
│   ├── api.js        # 로그인, 회원가입, 로그아웃 API
│   ├── hooks.js      # 인증 관련 커스텀 훅
│   └── components/   # 인증 관련 컴포넌트 (선택사항)
│
├── member/           # 회원 관련
│   ├── api.js        # 마이페이지, 회원 정보 수정 API
│   └── components/   # 회원 관련 컴포넌트 (선택사항)
│
├── question/         # 질문 관련
│   ├── api.js        # 질문 CRUD, 추천 API
│   ├── hooks.js      # 질문 관련 커스텀 훅
│   └── components/   # 질문 관련 컴포넌트 (선택사항)
│
├── answer/           # 답변 관련
│   ├── api.js        # 답변 CRUD, 추천 API
│   └── components/   # 답변 관련 컴포넌트 (선택사항)
│
└── admin/            # 관리자 관련
    ├── api.js        # 관리자 대시보드 API
    └── components/   # 관리자 관련 컴포넌트 (선택사항)
```

## 사용 방법

### API 함수 사용

```javascript
import * as questionApi from '@/features/question/api';

// 질문 목록 조회
const questions = await questionApi.getQuestions();

// 질문 생성
const newQuestion = await questionApi.createQuestion({
  title: '제목',
  content: '내용',
});
```

### 커스텀 훅 사용

```javascript
import { useQuestions } from '@/features/question/hooks';
import { useLogin } from '@/features/auth/hooks';

function MyComponent() {
  const { questions, loading, error } = useQuestions();
  const { login, loading: loginLoading } = useLogin();
  
  // ...
}
```

## 장점

1. **코드 응집도**: 관련 기능을 한 곳에 모아 관리
2. **재사용성**: API 함수와 훅을 여러 곳에서 재사용
3. **유지보수성**: 기능 변경 시 한 곳만 수정
4. **확장성**: 새 기능 추가 시 feature 폴더만 추가

