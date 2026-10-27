package com.example.demo.controller;

import com.example.demo.dto.CampaignRequestDto;
import com.example.demo.dto.CampaignResponseDto;
import com.example.demo.entity.SystemUser;
import com.example.demo.service.CampaignManagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignManagementService campaignManagementService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_CLIENT')")
    public ResponseEntity<CampaignResponseDto> createCampaign(
            @Valid @RequestBody CampaignRequestDto dto,
            @AuthenticationPrincipal SystemUser client) {
        CampaignResponseDto response = campaignManagementService.createCampaign(dto, client);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMANAGER') or hasAuthority('ROLE_CLIENT')")
    public ResponseEntity<CampaignResponseDto> updateCampaign(
            @PathVariable Long id,
            @Valid @RequestBody CampaignRequestDto dto,
            @AuthenticationPrincipal SystemUser user) {
        CampaignResponseDto response = campaignManagementService.updateCampaign(id, dto, user);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMANAGER')")
    public ResponseEntity<String> deleteCampaign(@PathVariable Long id) {
        campaignManagementService.deleteCampaign(id);
        return ResponseEntity.ok("MarketingCampaign deleted successfully.");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMANAGER') or hasAuthority('ROLE_CLIENT')")
    public ResponseEntity<CampaignResponseDto> getCampaignById(@PathVariable Long id) {
        return ResponseEntity.ok(campaignManagementService.getCampaignById(id));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMANAGER') or hasAuthority('ROLE_CLIENT')")
    public ResponseEntity<List<CampaignResponseDto>> getAllCampaigns(@AuthenticationPrincipal SystemUser user) {
        List<CampaignResponseDto> response;
        if (user.getRole() == SystemUser.UserRole.ADMANAGER) {
            response = campaignManagementService.getAllCampaigns();
        } else {
            response = campaignManagementService.getCampaignsForUser(user);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    @PreAuthorize("hasAuthority('ROLE_AUDIENCE')")
    public ResponseEntity<List<CampaignResponseDto>> getActiveCampaigns() {
        return ResponseEntity.ok(campaignManagementService.getActiveCampaigns());
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('ROLE_ADMANAGER')")
    public ResponseEntity<Void> approveCampaign(@PathVariable Long id) {
        campaignManagementService.approveCampaign(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('ROLE_ADMANAGER')")
    public ResponseEntity<Void> rejectCampaign(@PathVariable Long id) {
        campaignManagementService.rejectCampaign(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/click")
    public ResponseEntity<Void> incrementClickCount(@PathVariable Long id) {
        campaignManagementService.incrementClickCount(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/buy")
    public ResponseEntity<Void> buyCampaign(@PathVariable Long id) {
        campaignManagementService.buyCampaign(id);
        return ResponseEntity.ok().build();
    }
}