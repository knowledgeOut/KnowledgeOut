package org.example.backend.repository;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.example.backend.domain.category.Category;
import org.example.backend.domain.question.Question;
import org.example.backend.domain.question.QuestionTag;
import org.example.backend.domain.tag.Tag;
import org.springframework.data.jpa.domain.Specification;

public class QuestionSpecification {

    //삭제되지 않은 질문(status = false)만 필터링
    public static Specification<Question> isNotDeleted() {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("status"), false);
    }

    // 1. 카테고리 이름으로 필터링
    public static Specification<Question> equalCategory(String categoryName) {
        return (root, query, criteriaBuilder) -> {
            if (categoryName == null || categoryName.isEmpty()) return null;
            Join<Question, Category> category = root.join("category", JoinType.INNER);
            return criteriaBuilder.equal(category.get("name"), categoryName);
        };
    }

    // 2. 태그 이름으로 필터링
    public static Specification<Question> hasTag(String tagName) {
        return (root, query, criteriaBuilder) -> {
            if (tagName == null || tagName.isEmpty()) return null;
            Join<Question, QuestionTag> questionTags = root.join("questionTags", JoinType.INNER);
            Join<QuestionTag, Tag> tag = questionTags.join("tag", JoinType.INNER);
            query.distinct(true);
            return criteriaBuilder.equal(tag.get("name"), tagName);
        };
    }

    // 3. 답변 상태로 필터링
    public static Specification<Question> filterByStatus(String status) {
        return (root, query, criteriaBuilder) -> {
            if (status == null || status.isEmpty() || status.equals("ALL")) return null;

            if (status.equals("WAITING")) {
                return criteriaBuilder.isEmpty(root.get("answers"));
            } else if (status.equals("ANSWERED")) {
                return criteriaBuilder.isNotEmpty(root.get("answers"));
            }
            return null;
        };
    }

    // 4. 검색어(제목 + 내용) 필터링
    public static Specification<Question> containsKeyword(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.isEmpty()) return null;
            String likePattern = "%" + keyword.toLowerCase() + "%"; // LIKE %keyword%

            // 제목 또는(OR) 내용에 키워드가 포함되면 검색 (대소문자 무시)
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), likePattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("content")), likePattern)
            );
        };
    }
}