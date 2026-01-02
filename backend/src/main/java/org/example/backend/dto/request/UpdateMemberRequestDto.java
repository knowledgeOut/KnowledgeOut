package org.example.backend.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdateMemberRequestDto {
    // 닉네임은 선택적 (null이면 변경하지 않음)
    @Size(min = 2, message = "닉네임은 2자 이상이어야 합니다.")
    private String nickname;
    
    // 비밀번호는 선택적 (null이면 변경하지 않음)
    @Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다.")
    private String password;
}

