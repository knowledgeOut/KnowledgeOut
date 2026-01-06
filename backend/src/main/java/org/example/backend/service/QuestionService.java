package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.category.Category;
import org.example.backend.domain.member.Member;
import org.example.backend.domain.question.Question;
import org.example.backend.domain.question.QuestionTag;
import org.example.backend.domain.tag.Tag;
import org.example.backend.dto.request.QuestionRequestDto;
import org.example.backend.dto.response.QuestionResponseDto;
import org.example.backend.domain.question.QuestionLike;
import org.example.backend.repository.CategoryRepository;
import org.example.backend.repository.MemberRepository;
import org.example.backend.repository.QuestionLikeRepository;
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
    private final QuestionLikeRepository questionLikeRepository;

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
        // status 필드 설정 (null이면 기본값 false 사용)
        if (request.getStatus() != null) {
            question.setStatus(request.getStatus());
        }

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

        // 3. 좋아요 수 조회
        long likeCount = questionLikeRepository.countByQuestionId(id);
        
        // 4. DTO 변환 (Lazy Loading 발생 지점)
        // @Transactional 안에서 실행되므로 Member, Tags, Category 등을 안전하게 가져옵니다.
        return QuestionResponseDto.fromEntity(question, likeCount);
    }

    // 질문 목록 조회 (검색 조건 적용)
    public Page<QuestionResponseDto> getQuestions(Pageable pageable, String category, String tag, String status, String search) {
        Specification<Question> spec = createSpecification(category, tag, status, search);
        return questionRepository.findAll(spec, pageable)
                .map(question -> {
                    long likeCount = questionLikeRepository.countByQuestionId(question.getId());
                    return QuestionResponseDto.fromEntity(question, likeCount);
                });
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
        Specification<Question> spec = Specification.where(QuestionSpecification.isNotDeleted());

        // [수정된 부분] 검색어(search) 처리 로직
        if (search != null && !search.trim().isEmpty()) {
            String keyword = search.trim(); // 공백 제거

            if (keyword.startsWith("#")) {
                // 1. '#'으로 시작하면 태그 검색으로 간주
                // 예: "#자바" -> substring(1)을 통해 "자바"만 추출
                String tagName = keyword.substring(1);

                // '#'만 입력된 경우가 아닐 때만 실행
                if (!tagName.isEmpty()) {
                    spec = spec.and(QuestionSpecification.hasTag(tagName));
                }
            } else {
                // 2. '#'이 없으면 기존대로 제목+내용 검색
                spec = spec.and(QuestionSpecification.containsKeyword(keyword));
            }
        }

        if (category != null && !category.equals("전체") && !category.isEmpty()) {
            spec = spec.and(QuestionSpecification.equalCategory(category));
        }

        // 태그를 클릭해서 들어온 경우 (URL 파라미터 ?tag=...)
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

        // status 필드 업데이트 (null이 아니면 업데이트)
        if (request.getStatus() != null) {
            question.setStatus(request.getStatus());
        }

        if (request.getTagNames() != null) {
            question.getQuestionTags().clear(); // 기존 연관관계 제거 (OrphanRemoval 설정 필요)
            for (String tagName : request.getTagNames()) {
                Tag tag = tagService.findOrCreateTag(tagName);
                QuestionTag questionTag = new QuestionTag();
                questionTag.setTag(tag);
                question.addQuestionTag(questionTag);
            }
        }

        long likeCount = questionLikeRepository.countByQuestionId(questionId);
        return QuestionResponseDto.fromEntity(question, likeCount);
    }

    // 질문 추천 토글
    @Transactional
    public long toggleQuestionLike(Long questionId, String userEmail) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 질문입니다."));
        
        Member member = memberRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        
        // 이미 좋아요가 있는지 확인
        var existingLike = questionLikeRepository.findByQuestionIdAndMemberId(questionId, member.getId());
        
        if (existingLike.isPresent()) {
            // 좋아요 취소
            questionLikeRepository.delete(existingLike.get());
        } else {
            // 좋아요 추가
            QuestionLike questionLike = new QuestionLike(member, question);
            questionLikeRepository.save(questionLike);
        }
        
        // 현재 좋아요 수 반환
        return questionLikeRepository.countByQuestionId(questionId);
    }

    @Transactional
    public void deleteQuestion(String email, Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 질문입니다."));

        // 현재 사용자 조회
        Member currentMember = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 관리자가 아니고 작성자도 아닌 경우 삭제 권한 없음
        boolean isAdmin = currentMember.getRole() == org.example.backend.domain.member.Role.ROLE_ADMIN;
        
        // 작성자 확인: 탈퇴한 사용자의 경우 email이 null이므로 null 체크 필요
        Member questionAuthor = question.getMember();
        boolean isAuthor = false;
        if (questionAuthor != null && questionAuthor.getEmail() != null) {
            isAuthor = questionAuthor.getEmail().equals(email);
        }
        // 탈퇴한 사용자의 질문은 일반 사용자가 삭제할 수 없음 (관리자만 가능)
        
        if (!isAdmin && !isAuthor) {
            throw new IllegalStateException("삭제 권한이 없습니다.");
        }

        // 관리자가 아닌 경우에만 답변 체크
        if (!isAdmin) {
            // 답변 중 status가 false인 답변이 있으면 삭제 불가
            boolean hasActiveAnswer = question.getAnswers().stream()
                    .anyMatch(answer -> answer.isNotDeleted()); // status가 false인 답변이 있는지 확인

            if (hasActiveAnswer) {
                throw new IllegalStateException("삭제되지 않은 답변이 있는 질문은 삭제할 수 없습니다.");
            }
        } else {
            // 관리자인 경우 질문에 작성된 모든 답변도 함께 삭제 처리
            question.getAnswers().stream()
                    .filter(answer -> answer.isNotDeleted()) // 삭제되지 않은 답변만
                    .forEach(answer -> answer.delete()); // soft delete 수행
        }

        // 소프트 삭제: status를 true로 설정
        question.setStatus(true);
    }
}