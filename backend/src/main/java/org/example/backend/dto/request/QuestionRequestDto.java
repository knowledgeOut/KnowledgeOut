package org.example.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionRequestDto {
    private Long memberId;     
    private Long categoryId;    
    private String title;     
    private String content;     
    private List<String> tagNames;
    private Boolean status; // 질문 상태 (null일 수 있음)
}