# Lib

유틸리티 함수 및 헬퍼 함수 디렉토리

## 예상 파일 구조

- **api.ts** 또는 **api.js**: API 호출 함수들
  - `fetchQuestions()`: 질문 목록 조회
  - `fetchQuestion(id)`: 질문 상세 조회
  - `createQuestion(data)`: 질문 생성
  - `updateQuestion(id, data)`: 질문 수정
  - `deleteQuestion(id)`: 질문 삭제
  - `createAnswer(questionId, data)`: 답변 생성
  - `updateAnswer(questionId, data)`: 답변 수정
  - `deleteAnswer(questionId)`: 답변 삭제
  - `likeQuestion(id)`: 질문 추천
  - `likeAnswer(id)`: 답변 추천
  - `login(credentials)`: 로그인
  - `signup(data)`: 회원가입
  - `logout()`: 로그아웃
  - `fetchMyPage()`: 마이페이지 정보 조회
  - `fetchAdminDashboard()`: 관리자 대시보드 조회

- **utils.ts** 또는 **utils.js**: 공통 유틸리티 함수들
  - `formatDate(date)`: 날짜 포맷팅
  - `formatNumber(num)`: 숫자 포맷팅
  - 등등

- **constants.ts** 또는 **constants.js**: 상수 정의
  - API_BASE_URL
  - ROUTES
  - 등등

