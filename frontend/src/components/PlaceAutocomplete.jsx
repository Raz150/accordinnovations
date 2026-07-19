import { useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useJsApiLoader } from '@react-google-maps/api';
import { selectPlaceAsync } from '../store/placeSlice';

const libraries = ['places'];

const PlaceAutocomplete = () => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const dispatch = useDispatch();
  const { currentPlace } = useSelector((state) => state.places);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current || !window.google?.maps?.places?.Autocomplete) {
      // Exit if the API isn't loaded, the input isn't mounted, or autocomplete is already initialized.
      return;
    }

    // Initialize the Google Places Autocomplete instance
    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['establishment'],
      fields: ['place_id', 'name', 'formatted_address', 'geometry', 'types', 'vicinity'],
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();
      if (!place || !place.geometry) {
        // The user selected a place that doesn't have geometry || the request failed.
        console.warn('Autocomplete place selection failed:', place);
        return;
      }
      dispatch(selectPlaceAsync(place));
    });
  }, [dispatch, isLoaded]);

  useEffect(() => {
    if (currentPlace && inputRef.current) {
      inputRef.current.value = currentPlace.name || '';
    }
  }, [currentPlace]);

  const statusMessage = useMemo(() => {
    if (loadError) {
      return 'Google Maps could not be loaded.';
    }
    if (!isLoaded) {
      return 'Loading Google Maps…';
    }
    if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      return 'Set VITE_GOOGLE_MAPS_API_KEY to enable Google Places autocomplete.';
    }
    return null;
  }, [isLoaded, loadError]);

  return (
    <div className="w-100">
      <label className="form-label fw-semibold" htmlFor="place-search">
        Search for a place
      </label>
      <input
        id="place-search"
        ref={inputRef}
        className="form-control autocomplete-input"
        type="text"
        placeholder="Type a city, landmark, or address"
        disabled={!isLoaded || !!loadError || !import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      />
      {statusMessage && <div className="form-text mt-2">{statusMessage}</div>}
    </div>
  );
};

export default PlaceAutocomplete;
