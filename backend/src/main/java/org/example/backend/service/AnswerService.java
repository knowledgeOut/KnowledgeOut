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
}
