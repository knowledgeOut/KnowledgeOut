package org.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.backend.domain.question.Question;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public class QuestionResponseDto {
    private Long id;
    private String title;
    private String content;
    private int viewCount;
    private int answerCount; // [추가] 답변 개수 (프론트엔드 상태 표시용)
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    private Long memberId;
    private String memberNickname; 

    private Long categoryId;
    private String categoryName;   

    private List<String> tagNames;
    
    private List<AnswerResponseDto> answers; // 답변 목록

    public static QuestionResponseDto fromEntity(Question question) {
        // 답변 목록을 생성일시 기준 오름차순으로 정렬하여 변환 (soft delete 필터링)
        List<AnswerResponseDto> answers = question.getAnswers().stream()
                .filter(org.example.backend.domain.answer.Answer::isNotDeleted) // 삭제되지 않은 답변만
                .sorted(Comparator.comparing(org.example.backend.domain.answer.Answer::getCreatedAt))
                .map(AnswerResponseDto::fromEntity)
                .collect(Collectors.toList());
        
        return new QuestionResponseDto(
                question.getId(),
                question.getTitle(),
                question.getContent(),
                question.getViewCount(),
                answers.size(), // 삭제되지 않은 답변 개수
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
                // 답변 목록
                answers
        );
    }
}