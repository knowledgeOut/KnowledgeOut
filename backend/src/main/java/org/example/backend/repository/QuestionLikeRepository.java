package org.example.backend.repository;

import org.example.backend.domain.question.QuestionLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuestionLikeRepository extends JpaRepository<QuestionLike, Long> {
    List<QuestionLike> findByMemberId(Long memberId);
    
    // 특정 질문에 대한 사용자의 좋아요 조회
    Optional<QuestionLike> findByQuestionIdAndMemberId(Long questionId, Long memberId);
    
    // 특정 질문에 대한 좋아요 개수 조회
    long countByQuestionId(Long questionId);
}
