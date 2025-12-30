package org.example.backend.repository;

import org.example.backend.domain.question.QuestionLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionLikeRepository extends JpaRepository<QuestionLike, Long> {
    List<QuestionLike> findByMemberId(Long memberId);
}
