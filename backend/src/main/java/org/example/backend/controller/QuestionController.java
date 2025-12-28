package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
// import org.example.backend.domain.question.Question;
import org.example.backend.dto.request.QuestionRequestDto;
import org.example.backend.dto.response.MemberResponseDTO;
import org.example.backend.dto.response.QuestionResponseDto;
import org.example.backend.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/knowledgeout")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;

    @GetMapping("/questions")
    public ResponseEntity<List<QuestionResponseDto>> getAllQuestions() {
        List<QuestionResponseDto> questions = questionService.getAllQuestions();
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/questions")
    public ResponseEntity<Long> addQuestion(@RequestBody QuestionRequestDto questionRequestDto) {
        Long questionId = questionService.addQuestion(questionRequestDto);
        return ResponseEntity.ok(questionId);
    }
}
