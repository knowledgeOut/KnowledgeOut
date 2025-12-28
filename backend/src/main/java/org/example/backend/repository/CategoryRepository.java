package org.example.backend.repository;

import org.example.backend.domain.category.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    // 카테고리 이름으로 존재 여부 확인 (생성 시 중복 체크용)
    boolean existsByName(String name);

    // 이름으로 카테고리 조회
    Optional<Category> findByName(String name);
}