package org.example.backend.dto.response;

import lombok.Getter;
import org.example.backend.domain.member.Member;
import org.example.backend.domain.member.MemberStatus;
import org.example.backend.domain.member.Role;

import java.time.LocalDateTime;

@Getter
public class MemberResponseDto {
    private Long id;
    private String email;
    private String nickname;
    private Role role;
    private MemberStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    private MemberResponseDto(Long id, String email, String nickname, Role role,
                              MemberStatus status, LocalDateTime createdAt, LocalDateTime modifiedAt) {
        this.id = id;
        this.email = email;
        this.nickname = nickname;
        this.role = role;
        this.status = status;
        this.createdAt = createdAt;
        this.modifiedAt = modifiedAt;
    }

    public static MemberResponseDto fromEntity(Member member) {
        return new MemberResponseDto(
                member.getId(),
                member.getEmail(),
                member.getNickname(),
                member.getRole(),
                member.getStatus(),
                member.getCreatedAt(),
                member.getModifiedAt()
        );
    }
}