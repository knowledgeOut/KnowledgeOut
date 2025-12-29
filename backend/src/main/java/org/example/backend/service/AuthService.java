package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.member.Member;
import org.example.backend.dto.request.SignupRequestDto;
import org.example.backend.repository.MemberRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Long signup(SignupRequestDto request) {
        // 1. 중복 검사
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }
        if (memberRepository.existsByNickname(request.getNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        // 2. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // 3. Member 엔티티 생성 (정적 팩토리 메서드 활용)
        Member member = Member.create(
                request.getEmail(),
                encodedPassword,
                request.getNickname()
        );

        // 4. 저장
        memberRepository.save(member);

        return member.getId();
    }
}