import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFavoritesAsync } from '../store/placeSlice';

/**
 * FavoritesList Component - Display all favorite places
 * Demonstrates:
 * - Functional component with hooks
 * - Redux integration
 * - Async state management
 */
const FavoritesList = ({ maxItems = null, onSelectFavorite }) => {
  const dispatch = useDispatch();
  const { favorites, favoritesStatus, error } = useSelector((state) => state.places);

  useEffect(() => {
    if (favoritesStatus === 'idle') {
      dispatch(fetchAllFavoritesAsync());
    }
  }, [dispatch, favoritesStatus]);

  const displayedFavorites = maxItems ? favorites.slice(0, maxItems) : favorites;

  if (favoritesStatus === 'loading') {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading favorites...</span>
        </div>
      </div>
    );
  }

  if (error && favoritesStatus === 'failed') {
    return (
      <div className="alert alert-warning" role="alert">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (displayedFavorites.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        No favorite places yet. Search for a place and mark it as favorite!
      </div>
    );
  }

  return (
    <div className="favorites-list">
      <ul className="list-group list-group-flush">
        {displayedFavorites.map((favorite) => (
          <li
            key={favorite.placeId}
            className="list-group-item px-0 py-2 d-flex justify-content-between align-items-start cursor-pointer"
            onClick={onSelectFavorite ? () => onSelectFavorite(favorite) : undefined}
            style={{ cursor: onSelectFavorite ? 'pointer' : 'default' }}
          >
            <div className="flex-grow-1">
              <div className="fw-semibold">{favorite.name}</div>
              <div className="small text-muted">{favorite.address}</div>
              <div className="small text-secondary">
                📍 {favorite.latitude.toFixed(4)}, {favorite.longitude.toFixed(4)}
              </div>
            </div>
            {onSelectFavorite && (
              <div className="ms-2">
                <i className="bi bi-chevron-right text-muted" />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesList;
