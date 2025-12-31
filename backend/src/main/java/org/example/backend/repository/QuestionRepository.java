package org.example.backend.repository;

import org.example.backend.domain.question.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification; // 추가
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // 추가
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

// JpaSpecificationExecutor<Question> 상속 추가
public interface QuestionRepository extends JpaRepository<Question, Long>, JpaSpecificationExecutor<Question> {

    // 페이징 조회 (기존 메서드 유지)
    Page<Question> findAll(Pageable pageable);

    // 조회수 증가
    @Modifying
    @Query("update Question q set q.viewCount = q.viewCount + 1 where q.id = :id")
    void updateViewCount(@Param("id") Long id);

    List<Question>  findByMemberIdOrderByCreatedAtDesc(Long memberId);
}