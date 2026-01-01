package org.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.backend.domain.answer.Answer;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class AnswerResponseDto {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    
    private Long memberId;
    private String memberNickname;

    public static AnswerResponseDto fromEntity(Answer answer) {
        return new AnswerResponseDto(
                answer.getId(),
                answer.getContent(),
                answer.getCreatedAt(),
                answer.getModifiedAt(),
                answer.getMember().getId(),
                answer.getMember().getNickname()
        );
    }
}

