package com.accordinnovations.backend.dto;

import com.accordinnovations.backend.model.Favorite;
import java.time.LocalDateTime;

public class FavoriteResponse {
    private Long id;
    private String placeId;
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
    private LocalDateTime createdAt;

    public FavoriteResponse() {}

    public FavoriteResponse(Favorite favorite) {
        this.id = favorite.getId();
        this.placeId = favorite.getPlaceId();
        this.name = favorite.getName();
        this.address = favorite.getAddress();
        this.latitude = favorite.getLatitude();
        this.longitude = favorite.getLongitude();
        this.createdAt = favorite.getCreatedAt();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlaceId() {
        return placeId;
    }

    public void setPlaceId(String placeId) {
        this.placeId = placeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
