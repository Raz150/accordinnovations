import React, { useState, useEffect } from 'react';

/**
 * Button for toggling a place as a favorite.
 */
const FavoriteButton = ({ 
  place, 
  onFavoriteToggle, 
  isFavorited = false, 
  loading = false,
  renderProp,
  className = '',
  children
}) => {
  const [localIsFavorited, setLocalIsFavorited] = useState(isFavorited);
  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    setLocalIsFavorited(isFavorited);
  }, [isFavorited]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!place || !onFavoriteToggle) return;

    setIsLoading(true);
    try {
      await onFavoriteToggle(place, !localIsFavorited);
      setLocalIsFavorited((prev) => !prev);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (renderProp) {
    return renderProp({ isFavorited: localIsFavorited, loading: isLoading, onToggle: handleToggle });
  }

  // Default render
  return (
    <button
      className={`btn btn-${localIsFavorited ? 'danger' : 'outline-danger'} ${className}`}
      onClick={handleToggle}
      disabled={isLoading || !place}
      title={localIsFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <i className={`bi bi-heart${localIsFavorited ? '-fill' : ''}`} />
      {children || (localIsFavorited ? 'Remove from favorites' : 'Add to favorites')}
      {isLoading && <span className="ms-2 spinner-border spinner-border-sm" role="status" aria-hidden="true" />}
    </button>
  );
};

export default FavoriteButton;

/**
 * Higher-Order Component (HOC) pattern - withFavorite
 * Wraps a component to provide favorite functionality
 */
export const withFavorite = (WrappedComponent) => {
  return function FavoriteEnhancedComponent(props) {
    const { isFavorited = false, onFavoriteToggle } = props;

    return (
      <WrappedComponent
        {...props}
        isFavorited={isFavorited}
        onFavoriteToggle={onFavoriteToggle}
      />
    );
  };
};
