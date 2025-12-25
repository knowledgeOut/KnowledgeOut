package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
// import org.example.backend.domain.question.Question;
import org.example.backend.dto.request.QuestionRequestDto;
import org.example.backend.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/knowledgeout")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;

    @PostMapping("/questions")
    public ResponseEntity<Long> addQuestion(@RequestBody QuestionRequestDto questionRequestDto) {
        Long questionId = questionService.addQuestion(questionRequestDto);
        return ResponseEntity.ok(questionId);
    }
}
