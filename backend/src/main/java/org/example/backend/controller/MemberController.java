package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.UpdateMemberRequestDto;
import org.example.backend.dto.response.MemberResponseDto;
import org.example.backend.dto.response.MyAnswerResponseDto;
import org.example.backend.dto.response.QuestionResponseDto;
import org.example.backend.repository.MemberRepository;
import org.example.backend.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/knowledgeout/members")
public class MemberController {
    private final MemberService memberService;
    private final MemberRepository memberRepository;

    // 현재 로그인한 사용자 정보 조회 (선택적 인증 - 로그인하지 않은 경우 null 반환)
    @GetMapping("/current")
    public ResponseEntity<MemberResponseDto> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName().equals("anonymousUser") || !(authentication.getPrincipal() instanceof User)) {
            return ResponseEntity.noContent().build();
        }
        try {
            User user = (User) authentication.getPrincipal();
            Long memberId = memberRepository.findByEmail(user.getUsername())
                    .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."))
                    .getId();
            MemberResponseDto response = memberService.getMember(memberId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 마이페이지 정보 조회
    @GetMapping("/mypage")
    public ResponseEntity<MemberResponseDto> getMyPage(@AuthenticationPrincipal User user) {
        try {
            Long memberId = memberRepository.findByEmail(user.getUsername())
                    .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."))
                    .getId();
            MemberResponseDto response = memberService.getMember(memberId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 회원 정보 수정
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMember(@AuthenticationPrincipal User user, @PathVariable Long id, @Valid @RequestBody UpdateMemberRequestDto request) {
        try {
            // 현재 로그인한 사용자와 수정 대상 사용자가 일치하는지 확인
            Long currentUserId = memberRepository.findByEmail(user.getUsername())
                    .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."))
                    .getId();

            if (!currentUserId.equals(id)) {
                return ResponseEntity.status(403).body("본인만 수정할 수 있습니다."); // 본인만 수정 가능
            }

            MemberResponseDto response = memberService.updateMember(id, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/mypage/questions")
    public ResponseEntity<List<QuestionResponseDto>> myQuestions(@AuthenticationPrincipal User user) {
        try {
            Long memberId = memberRepository.findByEmail(user.getUsername())
                    .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."))
                    .getId();
            return ResponseEntity.ok(memberService.getMyQuestions(memberId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/mypage/answers")
    public ResponseEntity<List<MyAnswerResponseDto>> myAnswers(@AuthenticationPrincipal User user) {
        try {
            Long memberId = memberRepository.findByEmail(user.getUsername())
                    .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."))
                    .getId();
            return ResponseEntity.ok(memberService.getMyAnswers(memberId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/mypage/likes")
    public ResponseEntity<List<QuestionResponseDto>> myLikedQuestions(@AuthenticationPrincipal User user) {
        try {
            Long memberId = memberRepository.findByEmail(user.getUsername())
                    .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."))
                    .getId();
            return ResponseEntity.ok(memberService.getMyLikedQuestions(memberId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/mypage/withdraw")
    public ResponseEntity<Void> withdraw(@AuthenticationPrincipal User user) {
        try {
            Long memberId = memberRepository.findByEmail(user.getUsername())
                    .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."))
                    .getId();

            memberService.withdraw(memberId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}