package org.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.backend.domain.answer.Answer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public class AnswerResponseDto {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    
    private Long memberId;
    private String memberNickname;
    private List<String> tagNames;

    public static AnswerResponseDto fromEntity(Answer answer) {
        List<String> tagNames = answer.getAnswerTags().stream()
                .map(answerTag -> answerTag.getTag().getName())
                .collect(Collectors.toList());
        
        return new AnswerResponseDto(
                answer.getId(),
                answer.getContent(),
                answer.getCreatedAt(),
                answer.getModifiedAt(),
                answer.getMember().getId(),
                answer.getMember().getNickname(),
                tagNames
        );
    }
}

