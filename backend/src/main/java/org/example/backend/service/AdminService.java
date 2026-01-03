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

import java.time.LocalDateTime; // [추가] 날짜 계산을 위해 필요
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

    // [수정] int days 파라미터 추가
    public AdminDashboardDto getDashboardData(int days) {
        Pageable limit5 = PageRequest.of(0, 5);
        Pageable limit10 = PageRequest.of(0, 10);

        // [추가] 조회 기간 계산 (현재 시간 - 일수)
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);

        // 1. 인기 태그 Top 5 (기간 적용)
        // 리포지토리에 startDate를 전달
        List<ItemCountDto> topTags = questionRepository.findTopTags(startDate, limit5);

        // 2. 인기 카테고리 Top 5 (기간 적용)
        // 리포지토리에 startDate를 전달
        List<ItemCountDto> topCategories = questionRepository.findTopCategories(startDate, limit5);


        // 3. 카테고리별 질문 수 (전체 누적)
        List<Object[]> categoryRawData = questionRepository.countQuestionsByCategoryRaw();
        Map<String, Long> categoryCount = categoryRawData.stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> (Long) row[1]
                ));

        // 4. 태그별 질문 수 Top 10 (전체 누적)
        List<Object[]> tagRawData = questionRepository.countQuestionsByTagRaw(limit10);
        Map<String, Long> tagCount = tagRawData.stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> (Long) row[1]
                ));

        return new AdminDashboardDto(topTags, topCategories, categoryCount, tagCount);
    }
}