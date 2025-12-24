package org.example.backend.domain.member;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
//import org.example.backend.domain.answer.Answer;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "members")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberStatus status;

    @LastModifiedDate
    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

//    @OneToMany(mappedBy = "member")
//    private List<Question> questions = new ArrayList<>();

//    @OneToMany(mappedBy = "member")
//    private List<Answer> answers = new ArrayList<>();

    public static Member create(String email, String password, String nickname) {
        Member member = new Member();
        member.email = email;
        member.password = password;
        member.nickname = nickname;
        member.role = Role.ROLE_USER;
        member.status = MemberStatus.ACTIVE;
        return member;
    }

    // 탈퇴 처리
    public void withdraw() {
        this.status = MemberStatus.DELETED;
        this.email = null;
    }

    public boolean isActive() {
        return this.status.equals(MemberStatus.ACTIVE);
    }
}
