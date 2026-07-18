package com.accordinnovations.backend.repository;

import com.accordinnovations.backend.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    Optional<Favorite> findByPlaceId(String placeId);
    List<Favorite> findAllByOrderByCreatedAtDesc();
    void deleteByPlaceId(String placeId);
    boolean existsByPlaceId(String placeId);
}
