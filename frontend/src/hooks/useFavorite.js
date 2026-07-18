import { useState, useCallback, useEffect } from 'react';

/**
 * Hook for favorite-related API calls and local favorite state.
 */
export const useFavorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all favorites on mount
  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8081/api/favorites');
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      const data = await response.json();
      setFavorites(data);
    } catch (err) {
      setError(err.message || 'Unable to fetch favorites');
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addFavorite = useCallback(async (place) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8081/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId: place.placeId,
          name: place.name,
          address: place.address,
          latitude: place.lat,
          longitude: place.lng,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add favorite');
      }

      const newFavorite = await response.json();
      setFavorites((prev) => [newFavorite, ...prev]);
      return newFavorite;
    } catch (err) {
      setError(err.message || 'Unable to add favorite');
      console.error('Error adding favorite:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFavorite = useCallback(async (placeId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8081/api/favorites/${placeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove favorite');
      }

      setFavorites((prev) => prev.filter((fav) => fav.placeId !== placeId));
    } catch (err) {
      setError(err.message || 'Unable to remove favorite');
      console.error('Error removing favorite:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const isFavorited = useCallback((placeId) => {
    return favorites.some((fav) => fav.placeId === placeId);
  }, [favorites]);

  const checkFavoriteStatus = useCallback(async (placeId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/favorites/check/${placeId}`);
      if (!response.ok) {
        throw new Error('Failed to check favorite status');
      }
      const data = await response.json();
      return data.isFavorited;
    } catch (err) {
      console.error('Error checking favorite status:', err);
      return false;
    }
  }, []);

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorited,
    fetchFavorites,
    checkFavoriteStatus,
  };
};

export default useFavorite;
