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

    // --- [기존 기능] ---

    // 1. 기본 페이징 조회 (JpaRepository 기본 제공이지만 명시적으로 선언해도 무방함)
    Page<Question> findAll(Pageable pageable);

    // 2. 검색 조건(Specification)을 이용한 페이징 조회는 JpaSpecificationExecutor가 자동으로 처리하므로
    // 별도 메서드 선언 없이 service에서 repository.findAll(spec, pageable)로 호출 가능합니다.

    // 3. 조회수 증가 (벌크 연산)
    // clearAutomatically = true 옵션을 추가하면, 업데이트 후 영속성 컨텍스트를 비워
    // 이후 조회 시 DB의 최신 값을 가져오도록 보장해줍니다. (추천)
    @Modifying(clearAutomatically = true)
    @Query("update Question q set q.viewCount = q.viewCount + 1 where q.id = :id")
    void updateViewCount(@Param("id") Long id);

    // 4. 특정 회원이 작성한 질문 목록 (최신순)
    List<Question> findByMemberIdOrderByCreatedAtDesc(Long memberId);


    // --- [추가된 통계 기능] ---

    // 5. 인기 태그 Top N (이름 반환 + 개 수 반환)
    // 경로: Question -> QuestionTag -> Tag -> name
    @Query("SELECT new org.example.backend.dto.response.ItemCountDto(t.name, COUNT(q)) FROM Question q " +
            "JOIN q.questionTags qt " +
            "JOIN qt.tag t " +
            "WHERE q.createdAt >= :startDate " + //날짜 필터링 추가
            "GROUP BY t.name " +
            "ORDER BY COUNT(q) DESC, t.name ASC")
    List<ItemCountDto> findTopTags(@Param("startDate") LocalDateTime startDate, Pageable pageable);

    // 6. 인기 카테고리 Top N (이름 반환 + 개수 반환)
    @Query("SELECT new org.example.backend.dto.response.ItemCountDto(c.name, COUNT(q)) FROM Question q " +
            "JOIN q.category c " +
            "WHERE q.createdAt >= :startDate " + //날짜 필터링 추가
            "GROUP BY c.name " +
            "ORDER BY COUNT(q) DESC, c.name ASC")
    List<ItemCountDto> findTopCategories(@Param("startDate") LocalDateTime startDate, Pageable pageable);

    // 7. 카테고리별 질문 수 통계
    @Query("SELECT c.name, COUNT(q) FROM Question q " +
            "JOIN q.category c " +
            "GROUP BY c.name")
    List<Object[]> countQuestionsByCategoryRaw();

    // 8. 태그별 질문 수 통계
    @Query("SELECT t.name, COUNT(q) FROM Question q " +
            "JOIN q.questionTags qt " +
            "JOIN qt.tag t " +
            "GROUP BY t.name " +
            "ORDER BY COUNT(q) DESC")
    List<Object[]> countQuestionsByTagRaw(Pageable pageable);
}