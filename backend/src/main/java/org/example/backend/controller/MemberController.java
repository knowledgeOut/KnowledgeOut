package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.MemberRequestDto;
import org.example.backend.dto.response.MemberResponseDto;
import org.example.backend.dto.response.MyAnswerResponseDto;
import org.example.backend.dto.response.QuestionResponseDto;
import org.example.backend.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/knowledgeout/members")
public class MemberController {
    private final MemberService memberService;

    // TODO: 인증 기능 구현 후, 현재 로그인한 사용자 ID를 SecurityContext에서 가져오도록 수정 필요
    // 현재는 임시로 사용자 ID를 Query Parameter로 받도록 구현
    @GetMapping("/mypage")
    public ResponseEntity<MemberResponseDto> getMyPage(@RequestParam(required = false) Long id) {
        try {
            if (id == null) {
                return ResponseEntity.badRequest().build();
            }

            MemberResponseDto response = memberService.getMember(id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<MemberResponseDto> updateMember(@PathVariable Long id, @RequestBody MemberRequestDto request) {
        try {
            MemberResponseDto response = memberService.updateMember(id, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/mypage/questions")
    public ResponseEntity<List<QuestionResponseDto>> myQuestions(@RequestParam Long id) {
        return ResponseEntity.ok(memberService.getMyQuestions(id));
    }

    @GetMapping("/mypage/answers")
    public ResponseEntity<List<MyAnswerResponseDto>> myAnswers(@RequestParam Long id) {
        return ResponseEntity.ok(memberService.getMyAnswers(id));
    }

    @GetMapping("/mypage/likes")
    public ResponseEntity<List<QuestionResponseDto>> myQuestionLikes(@RequestParam Long id) {
        return ResponseEntity.ok(memberService.getMyQuestionLikes(id));
    }
}