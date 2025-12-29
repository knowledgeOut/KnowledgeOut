# Utils

유틸리티 함수 디렉토리

## 파일 구조

### date.js
날짜 관련 유틸리티 함수

```javascript
import { formatDate, getRelativeTime } from '@/utils/date';

// 날짜 포맷팅
const formatted = formatDate(new Date(), 'YYYY-MM-DD HH:mm');
// 결과: "2024-12-25 14:30"

// 상대 시간 표시
const relative = getRelativeTime(new Date(Date.now() - 3600000));
// 결과: "1시간 전"
```

## 함수 목록

- `formatDate(date, format)`: 날짜를 지정된 형식으로 포맷팅
- `getRelativeTime(date)`: 상대 시간 표시 (예: "3분 전")

