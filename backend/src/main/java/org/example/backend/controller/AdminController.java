package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.response.AdminDashboardDto;
import org.example.backend.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/knowledgeout/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDto> getDashboard(
            // days 파라미터 받기 (기본값 7)
            @RequestParam(name = "days", defaultValue = "7") int days
    ) {
        // 서비스 호출 시 days 전달
        return ResponseEntity.ok(adminService.getDashboardData(days));
    }
}