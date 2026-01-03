package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.response.AdminDashboardDto;
import org.example.backend.dto.response.ItemCountDto;
import org.example.backend.repository.CategoryRepository;
import org.example.backend.repository.QuestionRepository;
import org.example.backend.repository.TagRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final QuestionRepository questionRepository;
    private final TagRepository tagRepository;
    private final CategoryRepository categoryRepository;

    public AdminDashboardDto getDashboardData() {
        // Top 5 제한을 위한 Pageable 생성
        Pageable limit5 = PageRequest.of(0, 5);
        // Top 10 제한을 위한 Pageable 생성 (태그별 질문 수 등에서 사용)
        Pageable limit10 = PageRequest.of(0, 10);

        // 1. 인기 태그 Top 5 (이름 리스트 반환)
        List<ItemCountDto> topTags = questionRepository.findTopTags(limit5);

        // 2. 인기 카테고리 Top 5 (이름 리스트 반환)
        List<ItemCountDto> topCategories = questionRepository.findTopCategories(limit5);

        // 3. 카테고리별 질문 수 (List<Object[]> -> Map<String, Long> 변환)
        List<Object[]> categoryRawData = questionRepository.countQuestionsByCategoryRaw();
        Map<String, Long> categoryCount = categoryRawData.stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0], // Key: 카테고리 이름
                        row -> (Long) row[1]    // Value: 개수
                ));

        // 4. 태그별 질문 수 Top 10 (List<Object[]> -> Map<String, Long> 변환)
        List<Object[]> tagRawData = questionRepository.countQuestionsByTagRaw(limit10);
        Map<String, Long> tagCount = tagRawData.stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0], // Key: 태그 이름
                        row -> (Long) row[1]    // Value: 개수
                ));

        return new AdminDashboardDto(topTags, topCategories, categoryCount, tagCount);
    }
}