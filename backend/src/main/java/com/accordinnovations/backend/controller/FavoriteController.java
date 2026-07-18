package com.accordinnovations.backend.controller;

import com.accordinnovations.backend.dto.FavoriteRequest;
import com.accordinnovations.backend.dto.FavoriteResponse;
import com.accordinnovations.backend.service.FavoriteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FavoriteController {
    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping
    public ResponseEntity<?> addFavorite(@Valid @RequestBody FavoriteRequest request) {
        try {
            FavoriteResponse response = favoriteService.addFavorite(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<FavoriteResponse>> getAllFavorites() {
        return ResponseEntity.ok(favoriteService.getAllFavorites());
    }

    @GetMapping("/{placeId}")
    public ResponseEntity<?> getFavoriteByPlaceId(@PathVariable String placeId) {
        try {
            FavoriteResponse response = favoriteService.getFavoriteByPlaceId(placeId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/check/{placeId}")
    public ResponseEntity<Map<String, Object>> checkIfFavorited(@PathVariable String placeId) {
        boolean isFavorited = favoriteService.isFavorited(placeId);
        return ResponseEntity.ok(Map.of("placeId", placeId, "isFavorited", isFavorited));
    }

    @DeleteMapping("/{placeId}")
    public ResponseEntity<?> removeFavorite(@PathVariable String placeId) {
        try {
            favoriteService.removeFavorite(placeId);
            return ResponseEntity.ok(Map.of("message", "Favorite removed successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
}
