package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.QuestionRequestDto;
import org.example.backend.dto.response.QuestionResponseDto;
import org.example.backend.service.QuestionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/knowledgeout/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;

    // 질문 등록
    @PostMapping
    public ResponseEntity<Long> createQuestion(
            @AuthenticationPrincipal User user,
            @RequestBody QuestionRequestDto request) {
        Long questionId = questionService.addQuestion(user.getUsername(), request);
        return ResponseEntity.ok(questionId);
    }

    // 질문 목록 조회 (검색 조건 포함)
    @GetMapping
    public ResponseEntity<Page<QuestionResponseDto>> getQuestions(
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(questionService.getQuestions(pageable, category, tag, status, search));
    }

    // 질문 개수 조회
    @GetMapping("/count-summary")
    public ResponseEntity<org.example.backend.dto.response.QuestionCountDto> getQuestionCounts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(questionService.getQuestionCounts(category, search));
    }

    // 질문 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponseDto> getQuestion(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestion(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionResponseDto> updateQuestion(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody QuestionRequestDto request) {
        QuestionResponseDto updatedQuestion = questionService.updateQuestion(id, user.getUsername(), request);
        return ResponseEntity.ok(updatedQuestion);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        questionService.deleteQuestion(user.getUsername(), id);
        return ResponseEntity.ok().build();
    }
}