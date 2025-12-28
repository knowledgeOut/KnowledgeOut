package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.question.Question;
import org.example.backend.domain.question.QuestionTag;
import org.example.backend.domain.tag.Tag;
import org.example.backend.dto.request.QuestionRequestDto;
import org.example.backend.dto.response.QuestionResponseDto;
import org.example.backend.repository.QuestionRepository;
import org.example.backend.repository.MemberRepository;
import org.example.backend.repository.CategoryRepository;
import org.example.backend.domain.member.Member;
import org.example.backend.domain.category.Category;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final MemberRepository memberRepository;
    private final CategoryRepository categoryRepository;
    private final TagService tagService;

    public Long addQuestion(QuestionRequestDto request) {

        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));

        Question question = new Question();
        question.setTitle(request.getTitle());
        question.setContent(request.getContent());
        question.setMember(member);
        question.setCategory(category);

        if (request.getTagNames() != null) {
            for (String tagName : request.getTagNames()) {
                Tag tag = tagService.findOrCreateTag(tagName);

                QuestionTag questionTag = new QuestionTag();
                questionTag.setQuestion(question);
                questionTag.setTag(tag);
                question.getQuestionTags().add(questionTag);
            }
        }

        return questionRepository.save(question).getId();
    }

    @Transactional(readOnly = true)
    public List<QuestionResponseDto> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(QuestionResponseDto::from)
                .collect(Collectors.toList());
    }
}