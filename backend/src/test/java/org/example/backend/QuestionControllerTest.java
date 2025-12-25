package org.example.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend.controller.QuestionController;
import org.example.backend.dto.request.QuestionRequestDto;
import org.example.backend.service.QuestionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

// static import를 추가하면 코드가 훨씬 간결해집/니다.
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(QuestionController.class)
public class QuestionControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean // 또는 @MockBean
    private QuestionService questionService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void API_작동_테스트() throws Exception {
        // 서비스가 무조건 100L을 주도록 설정
        given(questionService.addQuestion(any())).willReturn(100L);

        mockMvc.perform(post("/api/knowledgeout/questions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"테스트\", \"content\":\"내용\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("100"));
    }
}