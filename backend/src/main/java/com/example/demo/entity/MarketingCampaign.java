package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "marketing_campaigns")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketingCampaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double budget;

    @Column(name = "target_roi")
    private Double targetRoi;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CampaignStatus status = CampaignStatus.PENDING_APPROVAL;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id", nullable = false)
    private SystemUser client;

    @Column(name = "click_count", nullable = false)
    @Builder.Default
    private int clickCount = 0;

    @Column(name = "buy_count", nullable = false)
    @Builder.Default
    private int buyCount = 0;

    public enum CampaignStatus {
        PENDING_APPROVAL, ACTIVE, REJECTED, EXPIRED
    }
}