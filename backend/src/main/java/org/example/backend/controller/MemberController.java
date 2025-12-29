package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.MemberUpdateRequestDto;
import org.example.backend.dto.response.MemberResponseDto;
import org.example.backend.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<MemberResponseDto> updateMember(@PathVariable Long id, @RequestBody MemberUpdateRequestDto request) {
        try {
            MemberResponseDto response = memberService.updateMember(id, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}