package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.AnswerRequestDto;
import org.example.backend.dto.response.AnswerResponseDto;
import org.example.backend.service.AnswerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/knowledgeout/questions/{id}/answers")
public class AnswerController {
    private final AnswerService answerService;

    @GetMapping
    public ResponseEntity<List<AnswerResponseDto>> getAnswers(@PathVariable Long id) {
        List<AnswerResponseDto> answers = answerService.getAnswersByQuestionId(id);
        return ResponseEntity.ok(answers);
    }

    @PostMapping
    public ResponseEntity<Long> createAnswer(@AuthenticationPrincipal User user, @PathVariable Long id, @RequestBody AnswerRequestDto request) {
        Long answerId = answerService.addAnswer(user.getUsername(), id, request);
        return ResponseEntity.ok(answerId);
    }

    @PutMapping("/{answerId}")
    public ResponseEntity<Void> updateAnswer(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @PathVariable Long answerId,
            @RequestBody AnswerRequestDto request) {
        answerService.updateAnswer(user.getUsername(), id, answerId, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{answerId}")
    public ResponseEntity<Void> deleteAnswer(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @PathVariable Long answerId) {
        answerService.deleteAnswer(user.getUsername(), id, answerId);
        return ResponseEntity.ok().build();
    }
}
