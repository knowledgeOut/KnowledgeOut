package org.example.backend.security;

import lombok.Getter;
import org.example.backend.domain.member.Member;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collections;

@Getter
public class MemberAdaptor extends User {

    private final Member member;

    public MemberAdaptor(Member member) {
        super(member.getEmail(),
                member.getPassword(),
                member.isActive(),
                true, true, true,
                Collections.singletonList(new SimpleGrantedAuthority(member.getRole().name())));
        this.member = member;
    }
}