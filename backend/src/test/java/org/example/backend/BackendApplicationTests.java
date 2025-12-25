package org.example.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend.dto.request.QuestionRequestDto;
import org.example.backend.service.QuestionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc // MockMvc를 자동으로 설정해줍니다.
class BackendApplicationTests {

    @Autowired
    private MockMvc mockMvc; // HTTP 호출을 시뮬레이션하는 객체

    @Autowired
    private ObjectMapper objectMapper; // 객체를 JSON 문자열로 변환해주는 객체

    @MockBean
    private QuestionService questionService; // 서비스 계층을 가짜(Mock) 객체로 주입

    @Test
    @DisplayName("질문 등록 API가 성공적으로 동작해야 한다")
    void addQuestionTest() throws Exception {
        // 1. 테스트용 데이터(DTO) 준비
        QuestionRequestDto requestDto = new QuestionRequestDto(
                1L, 1L, "테스트 제목", "테스트 내용", List.of("Java", "Spring")
        );

        // 2. 서비스 호출 시 가짜 응답 설정 (ID 1L 반환)
        Mockito.when(questionService.addQuestion(Mockito.any(QuestionRequestDto.class)))
                .thenReturn(1L);

        // 3. API 호출 및 결과 검증
        mockMvc.perform(post("/api/knowledgeout/questions") // POST 요청
                        .contentType(MediaType.APPLICATION_JSON) // JSON 형식으로 보냄
                        .content(objectMapper.writeValueAsString(requestDto))) // DTO를 JSON으로 변환
                .andExpect(status().isOk()) // 응답 상태가 200 OK인지 확인
                .andExpect(content().string("1")); // 응답 바디가 "1"인지 확인
    }
}