package org.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.backend.domain.question.Question;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class QuestionResponseDto {
    private Long id;
    private String title;
    private String content;
    private int viewCount;
    private int likeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long memberId;
    private String memberNickname; 

    private Long categoryId;
    private String categoryName;   

    private List<String> tagNames; 

    public static QuestionResponseDto fromEntity(Question question) {
        return new QuestionResponseDto(
            question.getId(),
            question.getTitle(),
            question.getContent(),
            question.getViewCount(),
            question.getLikeCount(),
            question.getCreatedAt(),
            question.getUpdatedAt(),
            question.getMemberId(),
            question.getMemberNickname(),
            question.getCategoryId(),
            question.getCategoryName(),
            question.getTagNames()
        );
    }
}