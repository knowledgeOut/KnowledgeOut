package org.example.backend.domain.question;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.domain.category.Category;
import org.example.backend.domain.member.Member;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name="questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    @ColumnDefault("0")
    private int viewCount;

    @ColumnDefault("0")
    private int likeCount;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime modifiedAt;

    // N:1 관계 - 회원
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    // N:1 관계 - 카테고리 (질문 하나가 하나의 카테고리에 속하는 일반적인 경우)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    // // // 1:N 관계 - 답변 (질문 삭제 시 답변도 삭제되는 CascadeType.REMOVE 적용)
    // @OneToMany(mappedBy = "question", cascade = CascadeType.REMOVE, orphanRemoval = true)
    // private List<Answer> answers = new ArrayList<>();

    // // 1:N 관계 - 태그 (중간 테이블 QuestionTag 활용)
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuestionTag> questionTags = new ArrayList<>();

}
