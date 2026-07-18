package com.accordinnovations.backend.service;

import com.accordinnovations.backend.dto.FavoriteRequest;
import com.accordinnovations.backend.dto.FavoriteResponse;
import com.accordinnovations.backend.model.Favorite;
import com.accordinnovations.backend.repository.FavoriteRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;

    public FavoriteService(FavoriteRepository favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    public FavoriteResponse addFavorite(FavoriteRequest request) {
        // Check if already favorited
        if (favoriteRepository.existsByPlaceId(request.getPlaceId())) {
            throw new IllegalArgumentException("This place is already marked as favorite");
        }

        Favorite favorite = new Favorite(
            request.getPlaceId(),
            request.getName(),
            request.getAddress(),
            request.getLatitude(),
            request.getLongitude()
        );

        Favorite savedFavorite = favoriteRepository.save(favorite);
        return new FavoriteResponse(savedFavorite);
    }

    public List<FavoriteResponse> getAllFavorites() {
        return favoriteRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(FavoriteResponse::new)
            .collect(Collectors.toList());
    }

    public FavoriteResponse getFavoriteByPlaceId(String placeId) {
        Favorite favorite = favoriteRepository.findByPlaceId(placeId)
            .orElseThrow(() -> new IllegalArgumentException("Favorite not found for placeId: " + placeId));
        return new FavoriteResponse(favorite);
    }

    public void removeFavorite(String placeId) {
        if (!favoriteRepository.existsByPlaceId(placeId)) {
            throw new IllegalArgumentException("Favorite not found for placeId: " + placeId);
        }
        favoriteRepository.deleteByPlaceId(placeId);
    }

    public boolean isFavorited(String placeId) {
        return favoriteRepository.existsByPlaceId(placeId);
    }
}
