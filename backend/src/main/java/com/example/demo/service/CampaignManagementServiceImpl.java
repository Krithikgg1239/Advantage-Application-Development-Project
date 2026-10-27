package com.example.demo.service;

import com.example.demo.dto.CampaignRequestDto;
import com.example.demo.dto.CampaignResponseDto;
import com.example.demo.entity.MarketingCampaign;
import com.example.demo.entity.SystemUser;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.repository.MarketingCampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CampaignManagementServiceImpl implements CampaignManagementService {

    private final MarketingCampaignRepository campaignRepository;

    @Override
    public CampaignResponseDto createCampaign(CampaignRequestDto dto, SystemUser client) {
        MarketingCampaign campaign = MarketingCampaign.builder()
                .name(dto.getName())
                .budget(dto.getBudget())
                .targetRoi(dto.getTargetRoi())
                .status(MarketingCampaign.CampaignStatus.PENDING_APPROVAL)
                .startDate(LocalDate.parse(dto.getStartDate()))
                .endDate(LocalDate.parse(dto.getEndDate()))
                .client(client)
                .clickCount(0)
                .buyCount(0)
                .build();

        MarketingCampaign saved = campaignRepository.save(campaign);
        return mapToResponse(saved);
    }

    @Override
    public CampaignResponseDto updateCampaign(Long id, CampaignRequestDto dto, SystemUser user) {
        MarketingCampaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new BusinessValidationException("Campaign not found"));

        boolean isOwner = campaign.getClient() != null && campaign.getClient().getId().equals(user.getId());
        boolean isAdManager = user.getRole() == SystemUser.UserRole.ADMANAGER;

        if (!isOwner && !isAdManager) {
            throw new BusinessValidationException("Not authorized to update this campaign");
        }

        campaign.setName(dto.getName());
        campaign.setStartDate(LocalDate.parse(dto.getStartDate()));
        campaign.setEndDate(LocalDate.parse(dto.getEndDate()));
        campaign.setBudget(dto.getBudget());
        campaign.setTargetRoi(dto.getTargetRoi());

        MarketingCampaign saved = campaignRepository.save(campaign);
        return mapToResponse(saved);
    }

    @Override
    public void deleteCampaign(Long id) {
        if (!campaignRepository.existsById(id)) {
            throw new BusinessValidationException("Campaign not found");
        }
        campaignRepository.deleteById(id);
    }

    @Override
    public void approveCampaign(Long id) {
        MarketingCampaign campaign = getCampaignOrThrow(id);
        campaign.setStatus(MarketingCampaign.CampaignStatus.ACTIVE);
        campaignRepository.save(campaign);
    }

    @Override
    public void rejectCampaign(Long id) {
        MarketingCampaign campaign = getCampaignOrThrow(id);
        campaign.setStatus(MarketingCampaign.CampaignStatus.REJECTED);
        campaignRepository.save(campaign);
    }

    @Override
    public CampaignResponseDto getCampaignById(Long id) {
        MarketingCampaign campaign = getCampaignOrThrow(id);
        checkAndSetExpired(campaign);
        return mapToResponse(campaign);
    }

    @Override
    public List<CampaignResponseDto> getAllCampaigns() {
        List<MarketingCampaign> campaigns = campaignRepository.findAll();
        campaigns.forEach(this::checkAndSetExpired);
        return campaigns.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CampaignResponseDto> getCampaignsForUser(SystemUser user) {
        List<MarketingCampaign> campaigns = campaignRepository.findAll().stream()
                .filter(c -> c.getClient() != null && c.getClient().getId().equals(user.getId()))
                .collect(Collectors.toList());
        campaigns.forEach(this::checkAndSetExpired);
        return campaigns.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CampaignResponseDto> getActiveCampaigns() {
        List<MarketingCampaign> campaigns = campaignRepository.findAll().stream()
                .filter(c -> c.getStatus() == MarketingCampaign.CampaignStatus.ACTIVE)
                .collect(Collectors.toList());
        campaigns.forEach(this::checkAndSetExpired);
        return campaigns.stream()
                .filter(c -> c.getStatus() == MarketingCampaign.CampaignStatus.ACTIVE)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void incrementClickCount(Long id) {
        MarketingCampaign campaign = getCampaignOrThrow(id);
        if (campaign.getStatus() == MarketingCampaign.CampaignStatus.ACTIVE) {
            campaign.setClickCount(campaign.getClickCount() + 1);
            campaignRepository.save(campaign);
        }
    }

    @Override
    public void buyCampaign(Long id) {
        MarketingCampaign campaign = getCampaignOrThrow(id);
        if (campaign.getStatus() == MarketingCampaign.CampaignStatus.ACTIVE) {
            campaign.setBuyCount(campaign.getBuyCount() + 1);
            campaignRepository.save(campaign);
        }
    }

    private MarketingCampaign getCampaignOrThrow(Long id) {
        return campaignRepository.findById(id)
                .orElseThrow(() -> new BusinessValidationException("Campaign not found"));
    }

    private void checkAndSetExpired(MarketingCampaign campaign) {
        if (campaign.getStatus() == MarketingCampaign.CampaignStatus.ACTIVE
                && campaign.getEndDate() != null
                && campaign.getEndDate().isBefore(LocalDate.now())) {
            campaign.setStatus(MarketingCampaign.CampaignStatus.EXPIRED);
            campaignRepository.save(campaign);
        }
    }

    private CampaignResponseDto mapToResponse(MarketingCampaign campaign) {
        return CampaignResponseDto.builder()
                .id(campaign.getId())
                .name(campaign.getName())
                .status(campaign.getStatus().name())
                .startDate(campaign.getStartDate())
                .endDate(campaign.getEndDate())
                .clickCount(campaign.getClickCount())
                .buyCount(campaign.getBuyCount())
                .budget(campaign.getBudget())
                .targetRoi(campaign.getTargetRoi())
                .clientUsername(campaign.getClient() != null ? campaign.getClient().getUsername() : null)
                .build();
    }
}