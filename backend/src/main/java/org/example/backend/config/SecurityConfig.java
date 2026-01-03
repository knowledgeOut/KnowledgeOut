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
                // 1. CSRF 비활성화 (중복 제거)
                .csrf(AbstractHttpConfigurer::disable)

                // 2. CORS 설정 적용
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3. 세션 관리 정책
                .sessionManagement(session ->
                        // session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                        // JWT 필터 구현시 해당 코드 지우고 STATELESS로 테스트 진행 필요
                        session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

                // 4. URL 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // (1) 공개 경로
                        .requestMatchers("/api/knowledgeout/members/signup", "/api/knowledgeout/members/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/knowledgeout", "/api/knowledgeout/questions/**", "/api/knowledgeout/categories").permitAll()

                        // (2) 관리자 경로
                        // 주의: DB 권한이 'ROLE_ADMIN'이면 hasRole("ADMIN")
                        // DB 권한이 그냥 'ADMIN'이면 hasAuthority("ADMIN") 사용
                        .requestMatchers("/api/knowledgeout/admin/**").hasRole("ADMIN")

                        // (3) 회원 전용 경로
                        .requestMatchers(
                                "/api/knowledgeout/members/mypage",
                                "/api/knowledgeout/members/mypage/**",
                                "/api/knowledgeout/members/{id}" // 본인 확인 로직은 Service나 Controller에서 추가 검증 필요
                        ).authenticated()

                        // (4) 그 외 나머지
                        .anyRequest().authenticated()
                )

                // 5. 예외 처리 (인증되지 않은 사용자 -> 401)
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(401); // 403 -> 401로 변경 (Unauthorized)
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"error\":\"로그인이 필요합니다.\"}");
                        })
                )

                // 6. 로그아웃 설정
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

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 중복 제거 및 통합된 설정
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:3001"
        ));
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}