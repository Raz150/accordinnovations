import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PlaceAutocomplete from './components/PlaceAutocomplete';
import MapView from './components/MapView';
import FavoriteButton from './components/FavoriteButton';
import FavoritesList from './components/FavoritesList';
import { clearError, saveFavoriteAsync, removeFavoriteAsync, checkFavoriteStatusAsync } from './store/placeSlice';

function App() {
  const dispatch = useDispatch();
  const { currentPlace, searchHistory, favorites, status, error, favoriteStatus, isFavorited } = useSelector(
    (state) => state.places
  );

  // Check if current place is favorited when it changes
  useEffect(() => {
    if (currentPlace?.placeId) {
      dispatch(checkFavoriteStatusAsync(currentPlace.placeId));
    }
  }, [currentPlace, dispatch]);

  const handleFavoriteToggle = async (place, shouldAdd) => {
    try {
      if (shouldAdd) {
        await dispatch(saveFavoriteAsync(place)).unwrap();
      } else {
        await dispatch(removeFavoriteAsync(place.placeId)).unwrap();
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      throw err;
    }
  };

  const handleSelectFavorite = (favorite) => {
    // Convert favorite to place format and select it
    // This would normally trigger a place selection action
    console.log('Selected favorite:', favorite);
  };

  return (
    <div className="container py-4 py-lg-5">
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="p-4 p-lg-5 rounded-4 shadow-sm bg-white">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
              <div>
                <p className="text-primary fw-semibold mb-2">Accord Innovations</p>
                <h1 className="display-6 fw-bold mb-2">Explore places with Google Autocomplete</h1>
                <p className="text-muted mb-0">
                  Search a place, view it on the map, and keep track of your recent selection history.
                </p>
              </div>
              <div className="badge bg-success-subtle text-success-emphasis px-3 py-2 rounded-pill">
                Redux + thunk powered
              </div>
            </div>

            <PlaceAutocomplete />

            <div className="mt-4 d-flex align-items-center gap-2 flex-wrap">
              <FavoriteButton
                place={currentPlace}
                isFavorited={isFavorited}
                loading={favoriteStatus === 'loading'}
                onFavoriteToggle={handleFavoriteToggle}
                className="flex-shrink-0"
              />
              {error ? (
                <button className="btn btn-outline-secondary" onClick={() => dispatch(clearError())}>
                  Dismiss
                </button>
              ) : null}
            </div>

            <div className="mt-4">
              {status === 'loading' ? <div className="alert alert-info">Searching place…</div> : null}
              {error ? <div className="alert alert-warning">{error}</div> : null}
              {currentPlace ? (
                <div className="card border-0 bg-light">
                  <div className="card-body">
                    <h2 className="h5 fw-semibold">Selected place</h2>
                    <p className="mb-1 fw-semibold">{currentPlace.name}</p>
                    <p className="mb-2 text-muted">{currentPlace.address}</p>
                    <p className="mb-0 small text-secondary">
                      Latitude: {currentPlace.lat}, Longitude: {currentPlace.lng}
                    </p>
                    {isFavorited && (
                      <div className="mt-2">
                        <span className="badge bg-danger">
                          <i className="bi bi-heart-fill me-1" />
                          Marked as favorite
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="alert alert-secondary mt-3">Choose a place to see its details and map marker.</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="p-4 rounded-4 shadow-sm bg-white h-100">
            <h2 className="h5 fw-semibold mb-3">Map preview</h2>
            <MapView />
            
            <div className="history-card p-3 mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h6 fw-semibold mb-0">Recent searches</h3>
                <span className="badge text-bg-light">{searchHistory.length}</span>
              </div>
              {searchHistory.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {searchHistory.map((item) => (
                    <li key={item.placeId} className="list-group-item px-0">
                      <div className="fw-semibold">{item.name}</div>
                      <div className="small text-muted">{item.address}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted mb-0">Your search history will appear here.</p>
              )}
            </div>

            <div className="favorites-card p-3 mt-4 border-top">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h6 fw-semibold mb-0">
                  <i className="bi bi-heart-fill text-danger me-2" />
                  Favorite places
                </h3>
                <span className="badge text-bg-danger">{favorites.length}</span>
              </div>
              <FavoritesList maxItems={5} onSelectFavorite={handleSelectFavorite} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
