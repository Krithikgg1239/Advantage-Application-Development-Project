package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampaignResponseDto {

    private Long id;
    private String name;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private int clickCount;
    private int buyCount;
    private String clientUsername;
    private Double budget;
    private Double targetRoi;
}