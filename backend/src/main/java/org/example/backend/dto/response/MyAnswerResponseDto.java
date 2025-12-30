package org.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.backend.domain.answer.Answer;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class MyAnswerResponseDto {
    private Long answerId;
    private String content;
    private LocalDateTime createdAt;

    private Long questionId;
    private String questionTitle;

    public static MyAnswerResponseDto fromEntity(Answer answer) {
        return new MyAnswerResponseDto(
                answer.getId(),
                answer.getContent(),
                answer.getCreatedAt(),
                answer.getQuestion().getId(),
                answer.getQuestion().getTitle()
        );
    }
}
