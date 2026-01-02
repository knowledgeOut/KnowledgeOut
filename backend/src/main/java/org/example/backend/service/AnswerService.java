package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.answer.Answer;
import org.example.backend.domain.member.Member;
import org.example.backend.domain.question.Question;
import org.example.backend.dto.request.AnswerRequestDto;
import org.example.backend.dto.response.AnswerResponseDto;
import org.example.backend.repository.AnswerRepository;
import org.example.backend.repository.MemberRepository;
import org.example.backend.repository.QuestionRepository;
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

    @Transactional
    public Long addAnswer(String userEmail, Long questionId, AnswerRequestDto request) {
        Member member = memberRepository.findByEmail(userEmail).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        Question question = questionRepository.findById(questionId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 질문입니다."));
        Answer answer = new Answer(request.getContent(), question, member);

        return answerRepository.save(answer).getId();
    }

    public List<AnswerResponseDto> getAnswersByQuestionId(Long questionId) {
        List<Answer> answers = answerRepository.findByQuestionIdOrderByCreatedAtAsc(questionId);
        return answers.stream()
                .map(AnswerResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateAnswer(String userEmail, Long questionId, Long answerId, AnswerRequestDto request) {
        Member member = memberRepository.findByEmail(userEmail).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        Answer answer = answerRepository.findById(answerId)
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
    }

    @Transactional
    public void deleteAnswer(String userEmail, Long questionId, Long answerId) {
        Member member = memberRepository.findByEmail(userEmail).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 답변입니다."));
        
        // 질문 ID 검증
        if (!answer.getQuestion().getId().equals(questionId)) {
            throw new IllegalArgumentException("질문과 답변이 일치하지 않습니다.");
        }
        
        // 작성자 검증
        if (!answer.getMember().getId().equals(member.getId())) {
            throw new IllegalArgumentException("답변을 삭제할 권한이 없습니다.");
        }
        
        answerRepository.delete(answer);
    }
}
