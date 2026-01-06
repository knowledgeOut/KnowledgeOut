package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.category.Category;
import org.example.backend.dto.response.CategoryResponseDto;
import org.example.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // 모든 카테고리 조회
    public List<CategoryResponseDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}