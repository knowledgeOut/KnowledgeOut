package org.example.backend.config;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.answer.Answer;
import org.example.backend.domain.category.Category;
import org.example.backend.domain.member.Member;
import org.example.backend.domain.question.Question;
import org.example.backend.domain.question.QuestionTag;
import org.example.backend.domain.tag.Tag;
import org.example.backend.repository.AnswerRepository;
import org.example.backend.repository.CategoryRepository;
import org.example.backend.repository.MemberRepository;
import org.example.backend.repository.QuestionRepository;
import org.example.backend.repository.TagRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final CategoryRepository categoryRepository;
    private final MemberRepository memberRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final TagRepository tagRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        // 카테고리 초기화
        initCategories();
        
        // 테스트 회원 및 질문 초기화 (이미 있으면 스킵)
        if (questionRepository.count() == 0) {
            initTestData();
        }
    }

    private void initCategories() {
        if (categoryRepository.count() == 0) {
            List<String> categoryNames = Arrays.asList("JAVA", "SPRING", "REACT", "DATABASE", "AWS");
            for (String name : categoryNames) {
                categoryRepository.save(new Category(name));
            }
        }
    }

    private void initTestData() {
        // 테스트 회원 생성
        Member member1 = createTestMember("test1@example.com", "테스트유저1");
        Member member2 = createTestMember("test2@example.com", "테스트유저2");
        Member member3 = createTestMember("test3@example.com", "테스트유저3");

        // 카테고리 가져오기
        Category reactCategory = categoryRepository.findByName("REACT")
                .orElseGet(() -> categoryRepository.save(new Category("REACT")));
        Category springCategory = categoryRepository.findByName("SPRING")
                .orElseGet(() -> categoryRepository.save(new Category("SPRING")));
        Category databaseCategory = categoryRepository.findByName("DATABASE")
                .orElseGet(() -> categoryRepository.save(new Category("DATABASE")));

        // 질문 1: React 관련
        Question question1 = new Question();
        question1.setTitle("React에서 상태 관리가 어려워요");
        question1.setContent("React를 사용하면서 상태 관리가 복잡해지고 있습니다. useState와 useEffect를 많이 사용하고 있는데, 더 나은 방법이 있을까요? Redux나 Zustand 같은 라이브러리를 사용해야 할까요?");
        question1.setMember(member1);
        question1.setCategory(reactCategory);
        question1.setViewCount(0);
        question1 = questionRepository.save(question1);

        // 질문 1에 태그 추가
        Tag reactTag = tagRepository.findByName("react")
                .orElseGet(() -> tagRepository.save(new Tag("react")));
        Tag stateTag = tagRepository.findByName("상태관리")
                .orElseGet(() -> tagRepository.save(new Tag("상태관리")));
        
        QuestionTag questionTag1_1 = new QuestionTag();
        questionTag1_1.setQuestion(question1);
        questionTag1_1.setTag(reactTag);
        question1.addQuestionTag(questionTag1_1);
        
        QuestionTag questionTag1_2 = new QuestionTag();
        questionTag1_2.setQuestion(question1);
        questionTag1_2.setTag(stateTag);
        question1.addQuestionTag(questionTag1_2);

        // 질문 2: Spring Boot 관련
        Question question2 = new Question();
        question2.setTitle("Spring Boot에서 JPA 연관관계 매핑 질문");
        question2.setContent("Spring Boot 프로젝트에서 JPA를 사용하고 있습니다. @OneToMany와 @ManyToOne 어노테이션을 사용할 때 주의해야 할 점이 무엇인가요? N+1 문제를 어떻게 해결할 수 있을까요?");
        question2.setMember(member2);
        question2.setCategory(springCategory);
        question2.setViewCount(0);
        question2 = questionRepository.save(question2);

        // 질문 2에 태그 추가
        Tag springTag = tagRepository.findByName("spring")
                .orElseGet(() -> tagRepository.save(new Tag("spring")));
        Tag jpaTag = tagRepository.findByName("jpa")
                .orElseGet(() -> tagRepository.save(new Tag("jpa")));
        
        QuestionTag questionTag2_1 = new QuestionTag();
        questionTag2_1.setQuestion(question2);
        questionTag2_1.setTag(springTag);
        question2.addQuestionTag(questionTag2_1);
        
        QuestionTag questionTag2_2 = new QuestionTag();
        questionTag2_2.setQuestion(question2);
        questionTag2_2.setTag(jpaTag);
        question2.addQuestionTag(questionTag2_2);

        // 질문 3: 데이터베이스 관련
        Question question3 = new Question();
        question3.setTitle("MySQL 인덱스 설계에 대해 궁금합니다");
        question3.setContent("MySQL에서 인덱스를 어떻게 설계해야 할까요? 어떤 컬럼에 인덱스를 걸어야 하는지, 복합 인덱스는 언제 사용하는지 알고 싶습니다. 성능 최적화를 위한 팁도 부탁드립니다.");
        question3.setMember(member3);
        question3.setCategory(databaseCategory);
        question3.setViewCount(0);
        question3 = questionRepository.save(question3);

        // 질문 3에 태그 추가
        Tag mysqlTag = tagRepository.findByName("mysql")
                .orElseGet(() -> tagRepository.save(new Tag("mysql")));
        Tag indexTag = tagRepository.findByName("인덱스")
                .orElseGet(() -> tagRepository.save(new Tag("인덱스")));
        Tag dbTag = tagRepository.findByName("데이터베이스")
                .orElseGet(() -> tagRepository.save(new Tag("데이터베이스")));
        
        QuestionTag questionTag3_1 = new QuestionTag();
        questionTag3_1.setQuestion(question3);
        questionTag3_1.setTag(mysqlTag);
        question3.addQuestionTag(questionTag3_1);
        
        QuestionTag questionTag3_2 = new QuestionTag();
        questionTag3_2.setQuestion(question3);
        questionTag3_2.setTag(indexTag);
        question3.addQuestionTag(questionTag3_2);
        
        QuestionTag questionTag3_3 = new QuestionTag();
        questionTag3_3.setQuestion(question3);
        questionTag3_3.setTag(dbTag);
        question3.addQuestionTag(questionTag3_3);

        // 변경사항 저장
        questionRepository.save(question1);
        questionRepository.save(question2);
        questionRepository.save(question3);

        // 답변 추가
        // 질문 2에 member3가 답변
        Answer answer1 = new Answer(
                "JPA 연관관계 매핑에서 주의할 점은 다음과 같습니다:\n\n1. 지연 로딩(Lazy Loading)을 기본으로 사용하세요.\n2. @OneToMany에서 mappedBy를 올바르게 설정하세요.\n3. N+1 문제는 @EntityGraph나 fetch join을 사용하여 해결할 수 있습니다.\n4. 양방향 연관관계에서는 연관관계의 주인을 명확히 하세요.",
                question2,
                member3
        );
        answerRepository.save(answer1);

        // 질문 3에 member1이 답변
        Answer answer2 = new Answer(
                "MySQL 인덱스 설계 시 고려사항:\n\n1. WHERE 절에서 자주 사용되는 컬럼에 인덱스를 생성하세요.\n2. 복합 인덱스는 자주 함께 조회되는 컬럼 조합에 사용하세요.\n3. 카디널리티가 높은 컬럼에 인덱스를 우선적으로 생성하세요.\n4. 인덱스는 SELECT 성능을 향상시키지만 INSERT/UPDATE 성능을 저하시킬 수 있으므로 적절한 균형이 필요합니다.",
                question3,
                member1
        );
        answerRepository.save(answer2);
    }

    private Member createTestMember(String email, String nickname) {
        return memberRepository.findByEmail(email)
                .orElseGet(() -> {
                    String encodedPassword = passwordEncoder.encode("password123");
                    Member member = Member.create(email, encodedPassword, nickname);
                    return memberRepository.save(member);
                });
    }
}

