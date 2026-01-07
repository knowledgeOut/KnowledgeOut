package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.answer.Answer;
import org.example.backend.domain.answer.AnswerTag;
import org.example.backend.domain.member.Member;
import org.example.backend.domain.question.Question;
import org.example.backend.domain.tag.Tag;
import org.example.backend.dto.request.AnswerRequestDto;
import org.example.backend.dto.response.AnswerResponseDto;
import org.example.backend.repository.AnswerRepository;
import org.example.backend.repository.MemberRepository;
import org.example.backend.repository.QuestionRepository;
import org.example.backend.service.TagService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnswerService {
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final MemberRepository memberRepository;
    private final TagService tagService;

    @Transactional
    public Long addAnswer(String userEmail, Long questionId, AnswerRequestDto request) {
        Member member = memberRepository.findByEmail(userEmail).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        Question question = questionRepository.findById(questionId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 질문입니다."));
        Answer answer = new Answer(request.getContent(), question, member);

        // 태그 처리
        if (request.getTagNames() != null) {
            for (String tagName : request.getTagNames()) {
                Tag tag = tagService.findOrCreateTag(tagName);
                AnswerTag answerTag = new AnswerTag();
                answerTag.setTag(tag);
                answer.addAnswerTag(answerTag);
            }
        }

        return answerRepository.save(answer).getId();
    }

    public List<AnswerResponseDto> getAnswersByQuestionId(Long questionId) {
        List<Answer> answers = answerRepository.findByQuestionIdAndStatusFalseOrderByCreatedAtAsc(questionId);
        return answers.stream()
                .map(AnswerResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateAnswer(String userEmail, Long questionId, Long answerId, AnswerRequestDto request) {
        Member member = memberRepository.findByEmail(userEmail).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        Answer answer = answerRepository.findByIdAndStatusFalse(answerId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 답변입니다."));
        
        // 질문 ID 검증
        if (!answer.getQuestion().getId().equals(questionId)) {
            throw new IllegalArgumentException("질문과 답변이 일치하지 않습니다.");
        }
        
        // 작성자 검증
        if (!answer.getMember().getId().equals(member.getId())) {
            throw new IllegalArgumentException("답변을 수정할 권한이 없습니다.");
        }
        
        answer.update(request.getContent());

        // 태그 업데이트
        if (request.getTagNames() != null) {
            answer.getAnswerTags().clear(); // 기존 연관관계 제거
            for (String tagName : request.getTagNames()) {
                Tag tag = tagService.findOrCreateTag(tagName);
                AnswerTag answerTag = new AnswerTag();
                answerTag.setTag(tag);
                answer.addAnswerTag(answerTag);
            }
        }
    }

    @Transactional
    public void deleteAnswer(String userEmail, Long questionId, Long answerId) {
        Member member = memberRepository.findByEmail(userEmail).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        Answer answer = answerRepository.findByIdAndStatusFalse(answerId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 답변입니다."));
        
        // 질문 ID 검증
        if (!answer.getQuestion().getId().equals(questionId)) {
            throw new IllegalArgumentException("질문과 답변이 일치하지 않습니다.");
        }
        
        // 관리자 권한 확인
        boolean isAdmin = member.getRole() == org.example.backend.domain.member.Role.ROLE_ADMIN;
        boolean isAuthor = answer.getMember().getId().equals(member.getId());
        
        // 관리자가 아니고 작성자도 아닌 경우 삭제 권한 없음
        if (!isAdmin && !isAuthor) {
            throw new IllegalArgumentException("답변을 삭제할 권한이 없습니다.");
        }
        
        // soft delete 수행
        answer.delete();
    }
}
