package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.answer.Answer;
import org.example.backend.domain.member.Member;
import org.example.backend.domain.question.Question;
import org.example.backend.dto.request.AnswerRequestDto;
import org.example.backend.repository.AnswerRepository;
import org.example.backend.repository.MemberRepository;
import org.example.backend.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public void updateAnswer(String userEmail, Long questionId, Long answerId, AnswerRequestDto request) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 답변입니다."));

        if (!answer.getQuestion().getId().equals(questionId)) {
            throw new IllegalArgumentException("질문과 답변이 일치하지 않습니다.");
        }

        if (!answer.getMember().getEmail().equals(userEmail)) {
            throw new IllegalStateException("수정 권한이 없습니다.");
        }

        answer.update(request.getContent());
    }

    @Transactional
    public void deleteAnswer(String userEmail, Long questionId, Long answerId) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 답변입니다."));

        if (!answer.getQuestion().getId().equals(questionId)) {
            throw new IllegalArgumentException("질문과 답변이 일치하지 않습니다.");
        }

        if (!answer.getMember().getEmail().equals(userEmail)) {
            throw new IllegalStateException("삭제 권한이 없습니다.");
        }

        answerRepository.delete(answer);
    }
}
