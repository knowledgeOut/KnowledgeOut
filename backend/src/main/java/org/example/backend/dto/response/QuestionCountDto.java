package org.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QuestionCountDto {
    private long totalCount;
    private long pendingCount;
    private long answeredCount;
}

