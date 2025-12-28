package org.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.backend.domain.question.Question;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public class QuestionResponseDto {
    private Long id;
    private String title;
    private String content;
    private int viewCount;
    private int likeCount;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    private Long memberId;
    private String memberNickname; 

    private Long categoryId;
    private String categoryName;   

    private List<String> tagNames; 

    public static QuestionResponseDto from(Question question) {
        return new QuestionResponseDto(
            question.getId(),
            question.getTitle(),
            question.getContent(),
            question.getViewCount(),
            question.getLikeCount(),
            question.getCreatedAt(),
            question.getModifiedAt(),
            question.getMember() != null ? question.getMember().getId() : null,
            question.getMember() != null ? question.getMember().getNickname() : null,
            question.getCategory() != null ? question.getCategory().getId() : null,
            question.getCategory() != null ? question.getCategory().getName() : null,
            question.getQuestionTags().stream()
                .map(qt -> qt.getTag().getName())
                .collect(Collectors.toList())
        );
    }
}