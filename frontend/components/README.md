# Components

재사용 가능한 UI 컴포넌트 디렉토리

## 구조

```
components/
├── ui/              # shadcn/ui 기반 기본 UI 컴포넌트
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
│
└── common/          # 프로젝트 전용 공통 컴포넌트
    ├── AuthModal.js
    └── ...
```

## 사용 방법

### UI 컴포넌트 (shadcn/ui)
```javascript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
```

### 공통 컴포넌트
```javascript
import AuthModal from '@/components/common/AuthModal';
```

## 참고

- `ui/` 폴더의 컴포넌트는 shadcn/ui 라이브러리 기반의 기본 컴포넌트입니다.
- `common/` 폴더의 컴포넌트는 프로젝트 특화된 비즈니스 로직을 포함한 컴포넌트입니다.

