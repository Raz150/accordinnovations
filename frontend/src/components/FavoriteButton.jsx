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
  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!place || !onFavoriteToggle) return;

    // The parent component will manage the loading state.
    // This button just triggers the action.
    try {
      await onFavoriteToggle(place, !isFavorited);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  if (renderProp) {
    return renderProp({ isFavorited: localIsFavorited, loading: isLoading, onToggle: handleToggle });
  }

  // Default render
  return (
    <button
      className={`btn btn-${isFavorited ? 'danger' : 'outline-danger'} ${className}`}
      onClick={handleToggle}
      disabled={loading || !place}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <i className={`bi bi-heart${isFavorited ? '-fill' : ''}`} />
      {children || (isFavorited ? 'Remove from favorites' : 'Add to favorites')}
      {loading && <span className="ms-2 spinner-border spinner-border-sm" role="status" aria-hidden="true" />}
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
