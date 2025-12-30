package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.member.Member;
import org.example.backend.dto.request.MemberRequestDto;
import org.example.backend.dto.response.MemberResponseDto;
import org.example.backend.dto.response.MyAnswerResponseDto;
import org.example.backend.dto.response.QuestionResponseDto;
import org.example.backend.repository.AnswerRepository;
import org.example.backend.repository.MemberRepository;
import org.example.backend.repository.QuestionLikeRepository;
import org.example.backend.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {
    private final MemberRepository memberRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final QuestionLikeRepository questionLikeRepository;

    // 마이페이지 기본 정보
    @Transactional(readOnly = true)
    public MemberResponseDto getMember(Long id) {
        Member member = memberRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));
        return MemberResponseDto.fromEntity(member);
    }

    public MemberResponseDto updateMember(Long id, MemberRequestDto request) {
        Member member = memberRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        if (!member.isActive()) {
            throw new IllegalArgumentException("탈퇴한 회원입니다.");
        }

        // 닉네임 중복 체크 (다른 회원이 사용 중인지 확인)
        if (request.getNickname() != null && !request.getNickname().isBlank()) {
            if (memberRepository.existsByNickname(request.getNickname())) {
                Member existingMember = memberRepository.findByNickname(request.getNickname()).orElseThrow();
                if (!existingMember.getId().equals(id)) {
                    throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
                }
            }
        }

        // 정보 업데이트 (이메일은 null로 전달하여 변경되지 않도록 함)
        member.update(null, request.getNickname());

        // 비밀번호 변경 (새로운 비밀번호 입력한 경우)
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            member.updatePassword(request.getPassword());
        }

        return MemberResponseDto.fromEntity(member);
    }

    public List<QuestionResponseDto> getMyQuestions(Long memberId) {
        return questionRepository.findByMemberIdOrderByCreatedAtDesc(memberId)
                .stream()
                .map(QuestionResponseDto::fromEntity)
                .toList();
    }

    public List<MyAnswerResponseDto> getMyAnswers(Long memberId) {
        return answerRepository.findByMemberIdOrderByCreatedAtDesc(memberId)
                .stream()
                .map(MyAnswerResponseDto::fromEntity)
                .toList();
    }

    public List<QuestionResponseDto> getMyQuestionLikes(Long memberId) {
        return questionLikeRepository.findByMemberId(memberId)
                .stream()
                .map(like -> QuestionResponseDto.fromEntity(like.getQuestion()))
                .toList();
    }
}