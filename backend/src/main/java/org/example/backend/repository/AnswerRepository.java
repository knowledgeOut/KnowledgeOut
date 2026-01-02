package org.example.backend.repository;

import org.example.backend.domain.answer.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByMemberIdOrderByCreatedAtDesc(Long memberId);
    List<Answer> findByQuestionIdOrderByCreatedAtAsc(Long questionId);
}
