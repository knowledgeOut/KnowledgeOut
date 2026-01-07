package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.member.Member;
import org.example.backend.dto.request.UpdateMemberRequestDto;
import org.example.backend.dto.response.MemberResponseDto;
import org.example.backend.dto.response.MyAnswerResponseDto;
import org.example.backend.dto.response.QuestionResponseDto;
import org.example.backend.exception.BusinessException;
import org.example.backend.exception.ErrorCode;
import org.example.backend.repository.AnswerRepository;
import org.example.backend.repository.MemberRepository;
import org.example.backend.repository.QuestionLikeRepository;
import org.example.backend.repository.QuestionRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final PasswordEncoder passwordEncoder;

    // 마이페이지 기본 정보
    @Transactional(readOnly = true)
    public MemberResponseDto getMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
        return MemberResponseDto.fromEntity(member);
    }

    public MemberResponseDto updateMember(Long id, UpdateMemberRequestDto request) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));

        if (!member.isActive()) {
            throw new BusinessException(ErrorCode.MEMBER_ALREADY_WITHDRAWN);
        }

        // 닉네임 변경 (새로운 닉네임 입력한 경우)
        if (request.getNickname() != null && !request.getNickname().isBlank()) {
            // 닉네임 중복 체크 (다른 회원이 사용 중인지 확인)
            if (memberRepository.existsByNickname(request.getNickname())) {
                Member existingMember = memberRepository.findByNickname(request.getNickname()).orElseThrow();
                if (!existingMember.getId().equals(id)) {
                    throw new BusinessException(ErrorCode.NICKNAME_DUPLICATED);
                }
            }
            // 닉네임 업데이트
            member.update(null, request.getNickname());
        }

        // 비밀번호 변경 (새로운 비밀번호 입력한 경우)
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            // 비밀번호 길이 검증 (8자 이상)
            if (request.getPassword().length() < 8) {
                throw new BusinessException(ErrorCode.PASSWORD_POLICY_VIOLATION);
            }
            // 현재 비밀번호와 동일한지 확인
            if (passwordEncoder.matches(request.getPassword(), member.getPassword())) {
                throw new BusinessException(ErrorCode.PASSWORD_SAME_AS_CURRENT);
            }
            // 비밀번호 암호화
            String encodedPassword = passwordEncoder.encode(request.getPassword());
            member.updatePassword(encodedPassword);
        }

        return MemberResponseDto.fromEntity(member);
    }

    public List<QuestionResponseDto> getMyQuestions(Long memberId) {
        return questionRepository.findByMemberIdAndStatusFalseOrderByCreatedAtDesc(memberId)
                .stream()
                .map(question -> {
                    long likeCount = questionLikeRepository.countByQuestionId(question.getId());
                    return QuestionResponseDto.fromEntity(question, likeCount);
                })
                .toList();
    }

    public List<MyAnswerResponseDto> getMyAnswers(Long memberId) {
        return answerRepository.findByMemberIdAndStatusFalseOrderByCreatedAtDesc(memberId)
                .stream()
                .map(MyAnswerResponseDto::fromEntity)
                .toList();
    }

    public List<QuestionResponseDto> getMyLikedQuestions(Long memberId) {
        return questionLikeRepository.findByMemberId(memberId)
                .stream()
                .map(like -> {
                    long likeCount = questionLikeRepository.countByQuestionId(like.getQuestion().getId());
                    return QuestionResponseDto.fromEntity(like.getQuestion(), likeCount);
                })
                .toList();
    }

    @Transactional
    public void withdraw(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));

        if (!member.isActive()) {
            throw new BusinessException(ErrorCode.MEMBER_ALREADY_WITHDRAWN);
        }

        member.withdraw();
    }
}