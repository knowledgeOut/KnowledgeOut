package org.example.backend.repository;

import org.example.backend.domain.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByNickname(String nickname);
    // 이메일 중복 검사용
    boolean existsByEmail(String email);
    // 닉네임 중복 검사용
    boolean existsByNickname(String nickname);
}