package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.MemberRequestDto;
import org.example.backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/knowledgeout/members")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // 최종 URL: POST http://localhost:8080/api/knowledgeout/members/signup
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody MemberRequestDto request) {
        authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("회원가입 성공");
    }
}