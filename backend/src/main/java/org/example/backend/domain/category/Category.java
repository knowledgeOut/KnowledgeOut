package org.example.backend.domain.category;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.backend.domain.question.Question;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    // 1:N 관계 - 하나의 카테고리에 여러 개의 질문이 포함됨
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Question> questions = new ArrayList<>();

    public Category(String name) {
        this.name = name;
    }

    // 카테고리명 수정 기능 (필요 시)
    public void updateName(String name) {
        this.name = name;
    }
}