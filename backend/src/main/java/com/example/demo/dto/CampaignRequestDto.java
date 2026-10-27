package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampaignRequestDto {

    @NotBlank
    private String name;

    @NotBlank
    private String startDate;

    @NotBlank
    private String endDate;

    @NotNull
    private Double budget;

    @NotNull
    private Double targetRoi;
}