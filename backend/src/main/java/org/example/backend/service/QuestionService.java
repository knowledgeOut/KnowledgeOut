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
        // 1. 조회수 증가
        // (먼저 증가시켜야 DB에 반영되고, 이후 조회 시 최신 viewCount를 가져옵니다)
        questionRepository.updateViewCount(id);

        // 2. 엔티티 조회
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 질문입니다."));

        // 3. DTO 변환 (Lazy Loading 발생 지점)
        // @Transactional 안에서 실행되므로 Member, Tags, Category 등을 안전하게 가져옵니다.
        return QuestionResponseDto.fromEntity(question);
    }

    // 질문 목록 조회 (검색 조건 적용)
    public Page<QuestionResponseDto> getQuestions(Pageable pageable, String category, String tag, String status, String search) {
        Specification<Question> spec = createSpecification(category, tag, status, search);
        return questionRepository.findAll(spec, pageable)
                .map(QuestionResponseDto::fromEntity);
    }

    // 질문 개수 조회
    public org.example.backend.dto.response.QuestionCountDto getQuestionCounts(String category, String search) {
        long total = questionRepository.count(createSpecification(category, null, null, search));
        long pending = questionRepository.count(createSpecification(category, null, "WAITING", search));
        long answered = questionRepository.count(createSpecification(category, null, "ANSWERED", search));
        return new org.example.backend.dto.response.QuestionCountDto(total, pending, answered);
    }

    // 공통 Specification 생성 로직
    private Specification<Question> createSpecification(String category, String tag, String status, String search) {
        Specification<Question> spec = Specification.where(null);
        if (search != null && !search.trim().isEmpty()) {
            spec = spec.and(QuestionSpecification.containsKeyword(search.trim()));
        }
        if (category != null && !category.equals("전체") && !category.isEmpty()) {
            spec = spec.and(QuestionSpecification.equalCategory(category));
        }
        if (tag != null) {
            spec = spec.and(QuestionSpecification.hasTag(tag));
        }
        if (status != null) {
            spec = spec.and(QuestionSpecification.filterByStatus(status));
        }
        return spec;
    }

    // 질문 수정
    @Transactional
    public QuestionResponseDto updateQuestion(Long questionId, String userEmail, QuestionRequestDto request) {

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 질문입니다."));

        if (!question.getMember().getEmail().equals(userEmail)) {
            throw new IllegalStateException("수정 권한이 없습니다.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));

        question.update(request.getTitle(), request.getContent(), category);

        if (request.getTagNames() != null) {
            question.getQuestionTags().clear(); // 기존 연관관계 제거 (OrphanRemoval 설정 필요)
            for (String tagName : request.getTagNames()) {
                Tag tag = tagService.findOrCreateTag(tagName);
                QuestionTag questionTag = new QuestionTag();
                questionTag.setTag(tag);
                question.addQuestionTag(questionTag);
            }
        }

        return QuestionResponseDto.fromEntity(question);
    }

    @Transactional
    public void deleteQuestion(String email, Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 질문입니다."));

        if (!question.getMember().getEmail().equals(email)) {
            throw new IllegalStateException("삭제 권한이 없습니다.");
        }

        // 답변이 있는 경우 삭제 불가
        if (!question.getAnswers().isEmpty()) {
            throw new IllegalStateException("답변이 작성된 질문은 삭제할 수 없습니다.");
        }

        questionRepository.delete(question);
    }
}