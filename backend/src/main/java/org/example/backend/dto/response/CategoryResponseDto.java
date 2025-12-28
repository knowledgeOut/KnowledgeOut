package org.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.backend.domain.category.Category;

@Getter
@AllArgsConstructor
public class CategoryResponseDto {
    private Long id;
    private String name;

    public static CategoryResponseDto fromEntity(Category category) {
        return new CategoryResponseDto(category.getId(), category.getName());
    }
}