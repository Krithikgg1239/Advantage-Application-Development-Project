package com.example.demo.service;

import com.example.demo.dto.CampaignRequestDto;
import com.example.demo.dto.CampaignResponseDto;
import com.example.demo.entity.SystemUser;
import java.util.List;

public interface CampaignManagementService {
    CampaignResponseDto createCampaign(CampaignRequestDto dto, SystemUser client);
    CampaignResponseDto updateCampaign(Long id, CampaignRequestDto dto, SystemUser user);
    void deleteCampaign(Long id);
    void approveCampaign(Long id);
    void rejectCampaign(Long id);
    CampaignResponseDto getCampaignById(Long id);
    List<CampaignResponseDto> getAllCampaigns();
    List<CampaignResponseDto> getCampaignsForUser(SystemUser user);
    List<CampaignResponseDto> getActiveCampaigns();
    void incrementClickCount(Long id);
    void buyCampaign(Long id);
}