package com.example.demo.repository;

import com.example.demo.entity.MarketingCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface MarketingCampaignRepository extends JpaRepository<MarketingCampaign, Long> {

    @Modifying
    @Transactional
    @Query("UPDATE MarketingCampaign c SET c.status = :status WHERE c.id = :id")
    void updateStatus(@Param("id") Long id, @Param("status") MarketingCampaign.CampaignStatus status);

    long countByStatus(MarketingCampaign.CampaignStatus status);

    Optional<MarketingCampaign> findByName(String name);

    @Query("SELECT c FROM MarketingCampaign c WHERE c.status = :status")
    List<MarketingCampaign> findAllByStatus(@Param("status") MarketingCampaign.CampaignStatus status);
}