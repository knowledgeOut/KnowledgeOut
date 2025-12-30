package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.AnswerRequestDto;
import org.example.backend.service.AnswerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/knowledgeout/questions/{id}/answers")
public class AnswerController {
    private final AnswerService answerService;

    @PostMapping
    public ResponseEntity<Long> createAnswer(@AuthenticationPrincipal User user, @PathVariable Long id, @RequestBody AnswerRequestDto request) {
        Long answerId = answerService.addAnswer(user.getUsername(), id, request);
        return ResponseEntity.ok(answerId);
    }
}
