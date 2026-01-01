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
    private int answerCount; // [추가] 답변 개수 (프론트엔드 상태 표시용)
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    private Long memberId;
    private String memberNickname; 

    private Long categoryId;
    private String categoryName;   

    private List<String> tagNames;
    
    private List<AnswerResponseDto> answers;

    public static QuestionResponseDto fromEntity(Question question) {
        return new QuestionResponseDto(
                question.getId(),
                question.getTitle(),
                question.getContent(),
                question.getViewCount(),
                0, // TODO: likeCount는 QuestionLikeRepository를 통해 계산 필요
                question.getAnswers().size(), // [추가] 답변 리스트 크기
                question.getCreatedAt(),
                question.getModifiedAt(),
                // Member 정보
                question.getMember().getId(),
                question.getMember().getNickname(),
                // Category 정보 (Null 처리)
                question.getCategory() != null ? question.getCategory().getId() : null,
                question.getCategory() != null ? question.getCategory().getName() : null,
                // Tag 정보
                question.getQuestionTags().stream()
                        .map(qt -> qt.getTag().getName())
                        .collect(Collectors.toList()),
                // Answers 정보
                question.getAnswers().stream()
                        .map(AnswerResponseDto::fromEntity)
                        .collect(Collectors.toList())
        );
    }
}