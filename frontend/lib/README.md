# Lib

라이브러리 및 유틸리티 함수 디렉토리

## 파일 구조

### axios.js
API 클라이언트 (fetch API 래퍼)
- 향후 Axios로 마이그레이션 가능하도록 인터페이스 통일
- GET, POST, PUT, DELETE 메서드 제공

```javascript
import apiClient from '@/lib/axios';

const data = await apiClient.get('/questions');
const result = await apiClient.post('/questions', { title: '제목' });
```

### auth.js
인증 관련 유틸리티 함수
- 로컬 스토리지에서 사용자 정보 관리
- 인증 상태 확인

```javascript
import { getUserId, setUser, isAuthenticated, clearAuth } from '@/lib/auth';

const userId = getUserId();
const authenticated = isAuthenticated();
```

### constants.js
애플리케이션 상수 정의
- API_BASE_URL
- ROUTES
- STORAGE_KEYS

```javascript
import { API_BASE_URL, ROUTES, STORAGE_KEYS } from '@/lib/constants';

const questionUrl = ROUTES.QUESTION_DETAIL(123);
```

