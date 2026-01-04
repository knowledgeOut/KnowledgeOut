package org.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/*
관리자 대시보드에서 질문 태그와 카테고리 수를 담기위해 사용하는 Dto
 */

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ItemCountDto {
    private String name;  // 항목 이름 (예: "Java", "자유게시판")
    private Long count;   // 개수 (예: 15)
}