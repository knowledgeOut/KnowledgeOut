package org.example.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

//엔티티 생성/수정시간
@Configuration
@EnableJpaAuditing
public class JpaAuditConfig {

}