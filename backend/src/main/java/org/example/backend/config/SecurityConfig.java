package org.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 1. [필수] 비밀번호 암호화 빈 (회원가입 서비스에서 사용)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 2. CORS 설정 적용
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3. CSRF 비활성화 (REST API이므로)
                .csrf(AbstractHttpConfigurer::disable)

                // 4. [중요] 세션 관리 정책을 STATELESS로 설정
                // (Next.js와 JWT를 사용할 것이므로 세션을 서버에 저장하지 않음)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 5. URL 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // 회원가입 및 로그인 경로는 누구나 접근 가능
                        // (로그인 경로도 미리 열어두었습니다)
                        .requestMatchers(
                                "/api/knowledgeout/members/signup",
                                "/api/knowledgeout/auth/login"
                        ).permitAll()

                        // 마이페이지 조회 및 수정은 임시로 허용 (인증 구현 전까지)
                        // TODO: 인증 기능 구현 후 인증 필요로 변경
                        .requestMatchers(
                                "/api/knowledgeout/members/mypage",
                                "/api/knowledgeout/members/**"
                        ).permitAll()

                        // 그 외 모든 요청은 인증 필요
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    // 6. CORS 구체적 설정 (통합)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 허용할 프론트엔드 도메인 (3000, 3001 둘 다 허용)
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:3001"
        ));

        // 허용할 HTTP 메서드 (PATCH 포함)
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        // 모든 헤더 허용
        configuration.setAllowedHeaders(List.of("*"));

        // 인증 정보(쿠키/토큰) 포함 허용
        configuration.setAllowCredentials(true);

        // Preflight 요청 캐시 시간 (1시간)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}