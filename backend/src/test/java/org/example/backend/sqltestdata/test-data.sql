use koDB;

-- 카테고리 데이터 (이미 있으면 무시)
INSERT IGNORE INTO categories (name) VALUES 
('JAVA'), 
('SPRING'), 
('REACT'), 
('DATABASE'), 
('AWS'),
('기타'), 
('기술'), 
('기능'), 
('버그');

-- 테스트 회원 생성 (BCrypt 해시: "password123" -> $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy)
-- 이미 존재하는 경우를 대비해 IGNORE 사용
INSERT IGNORE INTO members (email, password, nickname, role, status, created_at, modified_at) VALUES
('test1@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '테스트유저1', 'ROLE_USER', 'ACTIVE', NOW(), NOW()),
('test2@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '테스트유저2', 'ROLE_USER', 'ACTIVE', NOW(), NOW()),
('test3@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '테스트유저3', 'ROLE_USER', 'ACTIVE', NOW(), NOW());

-- 테스트 질문 3개 생성
-- 카테고리 ID를 가져와서 사용 (JAVA 카테고리 사용, 없으면 첫 번째 카테고리 사용)
SET @category_id = (SELECT id FROM categories WHERE name = 'JAVA' LIMIT 1);
SET @category_id = IFNULL(@category_id, (SELECT id FROM categories LIMIT 1));

-- 회원 ID 가져오기
SET @member_id_1 = (SELECT id FROM members WHERE email = 'test1@example.com' LIMIT 1);
SET @member_id_2 = (SELECT id FROM members WHERE email = 'test2@example.com' LIMIT 1);
SET @member_id_3 = (SELECT id FROM members WHERE email = 'test3@example.com' LIMIT 1);

-- 태그 생성 (질문 삽입 전에 태그를 먼저 생성)
INSERT IGNORE INTO tags (name) VALUES ('react'), ('상태관리'), ('spring'), ('jpa'), ('mysql'), ('인덱스'), ('데이터베이스');

-- 질문 1: React 관련 질문
INSERT INTO questions (title, content, view_count, member_id, category_id, created_at, modified_at) VALUES
('React에서 상태 관리가 어려워요', 
'React를 사용하면서 상태 관리가 복잡해지고 있습니다. useState와 useEffect를 많이 사용하고 있는데, 더 나은 방법이 있을까요? Redux나 Zustand 같은 라이브러리를 사용해야 할까요?', 
0, 
@member_id_1, 
(SELECT id FROM categories WHERE name = 'REACT' LIMIT 1), 
NOW(), 
NOW());

-- 질문 1에 태그 연결
SET @question_id_1 = LAST_INSERT_ID();
INSERT INTO question_tags (question_id, tag_id) 
SELECT @question_id_1, id FROM tags WHERE name IN ('react', '상태관리');

-- 질문 2: Spring Boot 관련 질문
INSERT INTO questions (title, content, view_count, member_id, category_id, created_at, modified_at) VALUES
('Spring Boot에서 JPA 연관관계 매핑 질문', 
'Spring Boot 프로젝트에서 JPA를 사용하고 있습니다. @OneToMany와 @ManyToOne 어노테이션을 사용할 때 주의해야 할 점이 무엇인가요? N+1 문제를 어떻게 해결할 수 있을까요?', 
0, 
@member_id_2, 
(SELECT id FROM categories WHERE name = 'SPRING' LIMIT 1), 
NOW(), 
NOW());

-- 질문 2에 태그 연결
SET @question_id_2 = LAST_INSERT_ID();
INSERT INTO question_tags (question_id, tag_id) 
SELECT @question_id_2, id FROM tags WHERE name IN ('spring', 'jpa');

-- 질문 3: 데이터베이스 관련 질문
INSERT INTO questions (title, content, view_count, member_id, category_id, created_at, modified_at) VALUES
('MySQL 인덱스 설계에 대해 궁금합니다', 
'MySQL에서 인덱스를 어떻게 설계해야 할까요? 어떤 컬럼에 인덱스를 걸어야 하는지, 복합 인덱스는 언제 사용하는지 알고 싶습니다. 성능 최적화를 위한 팁도 부탁드립니다.', 
0, 
@member_id_3, 
(SELECT id FROM categories WHERE name = 'DATABASE' LIMIT 1), 
NOW(), 
NOW());

-- 질문 3에 태그 연결
SET @question_id_3 = LAST_INSERT_ID();
INSERT INTO question_tags (question_id, tag_id) 
SELECT @question_id_3, id FROM tags WHERE name IN ('mysql', '인덱스', '데이터베이스');