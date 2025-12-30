package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.category.Category;
import org.example.backend.domain.member.Member;
import org.example.backend.domain.question.Question;
import org.example.backend.domain.question.QuestionTag;
import org.example.backend.domain.tag.Tag;
import org.example.backend.dto.request.QuestionRequestDto;
import org.example.backend.dto.response.QuestionResponseDto;
import org.example.backend.repository.CategoryRepository;
import org.example.backend.repository.MemberRepository;
import org.example.backend.repository.QuestionRepository;
import org.example.backend.repository.QuestionSpecification; // 추가
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification; // 추가
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final MemberRepository memberRepository;
    private final CategoryRepository categoryRepository;
    private final TagService tagService;

    // 질문 등록
    @Transactional
    public Long addQuestion(String userEmail, QuestionRequestDto request) {
        Member member = memberRepository.findByEmail(userEmail)
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
                questionTag.setTag(tag);
                question.addQuestionTag(questionTag);
            }
        }
        return questionRepository.save(question).getId();
    }

    // 질문 상세 조회
    @Transactional
    public QuestionResponseDto getQuestion(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 질문입니다."));
        questionRepository.updateViewCount(id);
        return QuestionResponseDto.fromEntity(question);
    }

    // 질문 목록 조회 (검색 조건 적용)
    public Page<QuestionResponseDto> getQuestions(Pageable pageable, String category, String tag, String status) {
        // 1. Specification 생성 (초기값: 조건 없음)
        Specification<Question> spec = Specification.where(null);

        // 2. 카테고리 조건 추가
        if (category != null) {
            spec = spec.and(QuestionSpecification.equalCategory(category));
        }

        // 3. 태그 조건 추가
        if (tag != null) {
            spec = spec.and(QuestionSpecification.hasTag(tag));
        }

        // 4. 상태 조건 추가 (WAITING, ANSWERED) - 현재는 로직 비활성 상태
        if (status != null) {
            spec = spec.and(QuestionSpecification.filterByStatus(status));
        }

        // 5. 조건에 맞는 데이터 조회
        return questionRepository.findAll(spec, pageable)
                .map(QuestionResponseDto::fromEntity);
    }

    @Transactional
    public void deleteQuestion(String email, Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 질문입니다."));

        if (!question.getMember().getEmail().equals(email)) {
            throw new IllegalStateException("삭제 권한이 없습니다.");
        }

        questionRepository.delete(question);
    }
}