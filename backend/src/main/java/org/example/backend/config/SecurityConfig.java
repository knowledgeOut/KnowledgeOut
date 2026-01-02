package org.example.backend.config;

import lombok.RequiredArgsConstructor;
import org.example.backend.security.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
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
@RequiredArgsConstructor
public class SecurityConfig {

    // 1. [필수] 비밀번호 암호화 빈 (회원가입 서비스에서 사용)
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return new ProviderManager(authProvider);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                // 2. CORS 설정 적용
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3. CSRF 비활성화 (REST API이므로)
                .csrf(AbstractHttpConfigurer::disable)

                // 4. [중요] 세션 관리 정책을 STATELESS로 설정
                // (Next.js와 JWT를 사용할 것이므로 세션을 서버에 저장하지 않음)
                .sessionManagement(session ->
                        // session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                        // JWT 필터 구현시 해당 코드 지우고 STATELESS로 테스트 진행 필요
                        session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

                // 5. URL 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // 공개 접근 가능한 경로 (순서 중요: 구체적인 경로를 먼저)
                        .requestMatchers("/api/knowledgeout/members/signup", "/api/knowledgeout/members/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/knowledgeout", "/api/knowledgeout/questions/**", "/api/knowledgeout/categories").permitAll()
                        
                        // 관리자 전용 경로
                        .requestMatchers("/api/knowledgeout/admin/**").hasRole("ADMIN")
                        
                        // 마이페이지 관련 경로는 인증 필요
                        .requestMatchers(
                                "/api/knowledgeout/members/mypage",
                                "/api/knowledgeout/members/mypage/**",
                                "/api/knowledgeout/members/{id}"
                        ).authenticated()

                        // 그 외 모든 요청은 인증 필요
                        .anyRequest().authenticated()
                )
                // 인증 실패 시 401/403 에러 반환 (기본 동작)
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(403);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"error\":\"인증이 필요합니다.\"}");
                        })
                )
                .logout(logout -> logout
                        .logoutUrl("/api/knowledgeout/members/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(200);
                        })
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                );

        return http.build();
    }

    // 6. CORS 구체적 설정 (통합)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

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