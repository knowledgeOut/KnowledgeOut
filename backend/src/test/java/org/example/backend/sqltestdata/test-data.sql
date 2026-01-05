use koDB;

# admin 계정 생성
# admin@test.com / admin1234
INSERT INTO members (
    email,
    password,
    nickname,
    role,
    status,
    created_at,
    modified_at
)
SELECT
    'admin@test.com',
    '$2a$10$7QJQ9x8l8XyRZJwQHkE5DOWsJHc8F4L4yF9z4Fz3pHq5mJ0vK8a9W',
    'admin',
    'ROLE_ADMIN',
    'ACTIVE',
    NOW(),
    NOW()
FROM dual
WHERE NOT EXISTS (
    SELECT 1 FROM members WHERE role = 'ROLE_ADMIN'
);

# member 계정 생성
# pass1234
INSERT INTO members (
    email,
    password,
    nickname,
    role,
    status,
    created_at,
    modified_at
) VALUES
      (
          'lion@test.com',
          '$2a$10$3g7Y4kZ3Uu5m9lqQ7cYwUeE4KJZ6zZ3J6G0u9P3sZQ2mE8fQF6QnK',
          'lion',
          'ROLE_USER',
          'ACTIVE',
          DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY),
          DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY)
      ),
      (
          'tiger@test.com',
          '$2a$10$3g7Y4kZ3Uu5m9lqQ7cYwUeE4KJZ6zZ3J6G0u9P3sZQ2mE8fQF6QnK',
          'tiger',
          'ROLE_USER',
          'ACTIVE',
          DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY),
          DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY)
      ),
      (
          'bear@test.com',
          '$2a$10$3g7Y4kZ3Uu5m9lqQ7cYwUeE4KJZ6zZ3J6G0u9P3sZQ2mE8fQF6QnK',
          'bear',
          'ROLE_USER',
          'ACTIVE',
          DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY),
          DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY)
      ),
      (
          'eagle@test.com',
          '$2a$10$3g7Y4kZ3Uu5m9lqQ7cYwUeE4KJZ6zZ3J6G0u9P3sZQ2mE8fQF6QnK',
          'eagle',
          'ROLE_USER',
          'ACTIVE',
          DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY),
          DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY)
      ),
      (
          'shark@test.com',
          '$2a$10$3g7Y4kZ3Uu5m9lqQ7cYwUeE4KJZ6zZ3J6G0u9P3sZQ2mE8fQF6QnK',
          'shark',
          'ROLE_USER',
          'ACTIVE',
          DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY),
          DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY)
      );

# 카테고리 등록
insert into categories (name) values ('기타'), ('기술'), ('기능'), ('버그');