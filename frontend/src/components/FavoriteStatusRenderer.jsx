import React from 'react';

/**
 * RenderProps Pattern Example Component
 * Demonstrates the render props pattern for flexible component composition
 * 
 * Usage:
 * <FavoriteStatusRenderer
 *   isFavorited={isFavorited}
 *   loading={loading}
 *   renderProp={(status) => <YourCustomUI {...status} />}
 * />
 */
const FavoriteStatusRenderer = ({ isFavorited = false, loading = false, renderProp }) => {
  const status = {
    isFavorited,
    loading,
    label: isFavorited ? 'Remove from favorites' : 'Add to favorites',
    icon: isFavorited ? 'heart-fill' : 'heart',
    badgeClass: isFavorited ? 'bg-danger' : 'bg-secondary',
  };

  if (renderProp) {
    return renderProp(status);
  }

  return (
    <span className={`badge ${status.badgeClass}`}>
      <i className={`bi bi-${status.icon} me-1`} />
      {status.label}
    </span>
  );
};

export default FavoriteStatusRenderer;
