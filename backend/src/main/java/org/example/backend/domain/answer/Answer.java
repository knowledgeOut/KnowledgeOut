package org.example.backend.domain.answer;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.backend.domain.member.Member;
import org.example.backend.domain.question.Question;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "answers")
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean status = false;

    // 생성자 및 편의 메서드는 필요 시 추가
    public Answer(String content, Question question, Member member) {
        this.content = content;
        this.question = question;
        this.member = member;
        this.status = false;
    }

    // 답변 수정 메서드
    public void update(String content) {
        this.content = content;
    }

    // 답변 삭제 메서드 (soft delete)
    public void delete() {
        this.status = true;
    }

    // 삭제되지 않은 답변인지 확인
    public boolean isNotDeleted() {
        return !this.status;
    }
}