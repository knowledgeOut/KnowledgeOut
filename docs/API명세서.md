## 작업 설명

### 공통

- Base URL

```bash
/api/knowledgeout
```

---

### 사용자

- 회원가입

```bash
POST /members/signup
```

- 로그인

```bash
POST /members/login
```

- 로그아웃

```bash
POST /members/logout
```

- 마이페이지

```bash
GET /members/mypage
```

- 회원 정보 수정

```bash
PUT /members/{id}
```

- 내가 작성한 질문 목록

```bash
GET /members/mypage/questions
```

- 내가 작성한 답변 목록

```bash
GET /members/mypage/answers
```

- 내가 추천한 질문 목록

```bash
GET /members/mypage/likes
```

---

### 카테고리

- 카테고리 목록 조회

```bash
GET /categories
```

---

### 질문 기능

- 질문 등록

```bash
POST /questions
```

- 질문 목록 조회 (페이지네이션, 검색 지원)

```bash
GET /questions?page=0&size=10&sort=createdAt,desc&category={category}&tag={tag}&status={status}
```

- 질문 상세 조회

```bash
GET /questions/{id}
```

- 질문 수정

```bash
PUT /questions/{id}
```

- 질문 삭제

```bash
DELETE /questions/{id}
```

---

### 답변 기능

- 답변 등록

```bash
POST /questions/{id}/answers
```

- 답변 수정

```bash
PUT /questions/{id}/answers
```

- 답변 삭제

```bash
DELETE /questions/{id}/answers?answerId={answerId}
```

---

### 추천 기능

- 질문 추천

```bash
POST /questions/{id}/likes
```

- 답변 추천

```bash
POST /answers/{id}/likes
```

---

### 관리자

- 대시보드

```bash
GET /admin/dashboard
```

## 하위 작업

- [x]  초안 작성(해인)