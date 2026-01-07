package org.example.backend.repository;

import org.example.backend.domain.answer.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByMemberIdAndStatusFalseOrderByCreatedAtDesc(Long memberId);
    List<Answer> findByQuestionIdAndStatusFalseOrderByCreatedAtAsc(Long questionId);
    
    // 삭제되지 않은 답변만 조회 (status = false)
    Optional<Answer> findByIdAndStatusFalse(Long id);
}
