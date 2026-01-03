## API 명세서

### 공통

**Base URL**: `/api/knowledgeout`

**인증 방식**: Spring Security 세션 기반 인증 (쿠키 사용)

---

### 사용자 인증 및 관리

#### 회원가입
```http
POST /members/signup
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "사용자닉네임"
}

Response: "회원가입 성공" (201 Created)
```

#### 로그인
```http
POST /members/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "status": "Success",
  "message": "로그인이 완료되었습니다."
}
```

#### 로그아웃
```http
POST /members/logout

Response: 200 OK
```

#### 마이페이지 정보 조회
```http
GET /members/mypage
Authorization: Required

Response:
{
  "id": 1,
  "email": "user@example.com",
  "nickname": "사용자닉네임",
  "role": "ROLE_USER",
  "status": "ACTIVE",
  "createdAt": "2024-01-01T00:00:00",
  "modifiedAt": "2024-01-01T00:00:00"
}
```

#### 회원 정보 수정
```http
PUT /members/{id}
Authorization: Required
Content-Type: application/json

Request Body:
{
  "nickname": "새닉네임" (optional),
  "password": "newpassword123" (optional)
}

Response: MemberResponseDto
```

#### 회원 탈퇴
```http
DELETE /members/mypage/withdraw
Authorization: Required

Response: 204 No Content
```

#### 내가 작성한 질문 목록
```http
GET /members/mypage/questions
Authorization: Required

Response: QuestionResponseDto[]
```

#### 내가 작성한 답변 목록
```http
GET /members/mypage/answers
Authorization: Required

Response: MyAnswerResponseDto[]
```

#### 내가 추천한 질문 목록
```http
GET /members/mypage/likes
Authorization: Required

Response: QuestionResponseDto[]
```

---

### 카테고리

#### 카테고리 목록 조회
```http
GET /categories

Response: CategoryResponseDto[]
```

---

### 질문 기능

#### 질문 등록
```http
POST /questions
Authorization: Required
Content-Type: application/json

Request Body:
{
  "title": "질문 제목",
  "content": "질문 내용",
  "categoryId": 1,
  "tagNames": ["태그1", "태그2"] (optional)
}

Response: Long (질문 ID)
```

#### 질문 목록 조회
```http
GET /questions?page=0&size=10&sort=createdAt,desc&category={category}&tag={tag}&status={status}&search={search}
```

**Query Parameters:**
- `page`: 페이지 번호 (0부터 시작, 기본값: 0)
- `size`: 페이지 크기 (기본값: 10)
- `sort`: 정렬 기준 (기본값: createdAt,desc)
- `category`: 카테고리 필터 (선택)
- `tag`: 태그 필터 (선택)
- `status`: 상태 필터 - `WAITING` (미답변) 또는 `ANSWERED` (답변완료) (선택)
- `search`: 검색어 (선택)

**Response:**
```json
{
  "content": [QuestionResponseDto[]],
  "totalElements": 100,
  "totalPages": 10,
  "number": 0,
  "size": 10,
  "first": true,
  "last": false
}
```

#### 질문 개수 조회
```http
GET /questions/count-summary?category={category}&search={search}
```

**Query Parameters:**
- `category`: 카테고리 필터 (선택)
- `search`: 검색어 (선택)

**Response:**
```json
{
  "totalCount": 100,
  "pendingCount": 50,
  "answeredCount": 50
}
```

#### 질문 상세 조회
```http
GET /questions/{id}
```

**Response:**
```json
{
  "id": 1,
  "title": "질문 제목",
  "content": "질문 내용",
  "viewCount": 10,
  "answerCount": 2,
  "createdAt": "2024-01-01T00:00:00",
  "modifiedAt": "2024-01-01T00:00:00",
  "memberId": 1,
  "memberNickname": "작성자",
  "categoryId": 1,
  "categoryName": "카테고리명",
  "tagNames": ["태그1", "태그2"],
  "answers": [AnswerResponseDto[]]
}
```

#### 질문 수정
```http
PUT /questions/{id}
Authorization: Required (작성자만)
Content-Type: application/json

Request Body:
{
  "title": "수정된 제목",
  "content": "수정된 내용",
  "categoryId": 1,
  "tagNames": ["태그1", "태그2"]
}

Response: QuestionResponseDto
```

#### 질문 삭제
```http
DELETE /questions/{id}
Authorization: Required (작성자만)

Response: 200 OK
```

---

### 답변 기능

#### 답변 목록 조회
```http
GET /questions/{id}/answers

Response: AnswerResponseDto[]
```

#### 답변 등록
```http
POST /questions/{id}/answers
Authorization: Required
Content-Type: application/json

Request Body:
{
  "content": "답변 내용"
}

Response: Long (답변 ID)
```

#### 답변 수정
```http
PUT /questions/{id}/answers/{answerId}
Authorization: Required (작성자만)
Content-Type: application/json

Request Body:
{
  "content": "수정된 답변 내용"
}

Response: 200 OK
```

#### 답변 삭제 (Soft Delete)
```http
DELETE /questions/{id}/answers/{answerId}
Authorization: Required (작성자만)

Response: 200 OK
```

**Note**: 실제로 데이터베이스에서 삭제되지 않고 `status` 필드가 `true`로 설정됩니다.

---

### 추천 기능

#### 질문 추천
```http
POST /questions/{id}/likes
Authorization: Required

Response: 200 OK
```

#### 답변 추천
```http
POST /answers/{id}/likes
Authorization: Required

Response: 200 OK
```

---

### 관리자

#### 대시보드
```http
GET /admin/dashboard
Authorization: Required (ADMIN 권한)

Response: DashboardDto
```

---

## 인증 및 권한

### 공개 접근 가능한 엔드포인트
- `POST /members/signup`
- `POST /members/login`
- `GET /questions/**`
- `GET /categories`

### 인증 필요 엔드포인트
- 모든 `/members/mypage/**` 엔드포인트
- 질문/답변 등록, 수정, 삭제 엔드포인트
- 추천 엔드포인트

### 관리자 전용 엔드포인트
- `/admin/**`

---

## 업데이트 내역

- [x] 초안 작성(해인)
- [x] 답변 목록 조회 API 추가
- [x] 답변 soft delete 구현
- [x] 질문 상세 조회에 답변 목록 포함
- [x] 질문 개수 조회 API 추가
- [x] 회원 탈퇴 API 추가