package org.example.backend.repository;

import org.example.backend.domain.question.Question;
import org.example.backend.dto.response.ItemCountDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long>, JpaSpecificationExecutor<Question> {

    //기본 페이징 조회
    Page<Question> findAll(Pageable pageable);

    //조회수 증가
    @Modifying(clearAutomatically = true)
    @Query("update Question q set q.viewCount = q.viewCount + 1 where q.id = :id")
    void updateViewCount(@Param("id") Long id);

    //특정 회원이 작성한 질문 목록 (최신순)
    List<Question> findByMemberIdOrderByCreatedAtDesc(Long memberId);

    //특정 회원이 작성한 삭제되지 않은 질문 목록 (최신순)
    List<Question> findByMemberIdAndStatusFalseOrderByCreatedAtDesc(Long memberId);


    //인기 태그 Top N (이름 반환 + 개 수 반환)
    // 경로: Question -> QuestionTag -> Tag -> name
    @Query("SELECT new org.example.backend.dto.response.ItemCountDto(t.name, COUNT(q)) FROM Question q " +
            "JOIN q.questionTags qt " +
            "JOIN qt.tag t " +
            "WHERE q.createdAt >= :startDate " + //날짜 필터링 추가
            "GROUP BY t.name " +
            "ORDER BY COUNT(q) DESC, t.name ASC")
    List<ItemCountDto> findTopTags(@Param("startDate") LocalDateTime startDate, Pageable pageable);

    //인기 카테고리 Top N (이름 반환 + 개수 반환)
    @Query("SELECT new org.example.backend.dto.response.ItemCountDto(c.name, COUNT(q)) FROM Question q " +
            "JOIN q.category c " +
            "WHERE q.createdAt >= :startDate " + //날짜 필터링 추가
            "GROUP BY c.name " +
            "ORDER BY COUNT(q) DESC, c.name ASC")
    List<ItemCountDto> findTopCategories(@Param("startDate") LocalDateTime startDate, Pageable pageable);

    //카테고리별 질문 수 통계
    @Query("SELECT c.name, COUNT(q) FROM Question q " +
            "JOIN q.category c " +
            "GROUP BY c.name")
    List<Object[]> countQuestionsByCategoryRaw();

    //태그별 질문 수 통계
    @Query("SELECT t.name, COUNT(q) FROM Question q " +
            "JOIN q.questionTags qt " +
            "JOIN qt.tag t " +
            "GROUP BY t.name " +
            "ORDER BY COUNT(q) DESC")
    List<Object[]> countQuestionsByTagRaw(Pageable pageable);
}