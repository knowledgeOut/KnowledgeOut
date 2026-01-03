package org.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDto {
    private List<String> topTags;
    private List<String> topCategories;
    private Map<String, Long> categoryCount;
    private Map<String, Long> tagCount;
}
