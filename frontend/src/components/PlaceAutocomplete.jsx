import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { selectPlaceAsync } from '../store/placeSlice';

const PlaceAutocomplete = () => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const dispatch = useDispatch();
  const [readyState, setReadyState] = useState('loading');
  const [message, setMessage] = useState('Loading Google Maps…');

  useEffect(() => {
    if (window.google?.maps?.places) {
      setReadyState('ready');
      setMessage('');
      return;
    }

    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        setReadyState('ready');
        setMessage('');
      });
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setReadyState('missing-key');
      setMessage('Set VITE_GOOGLE_MAPS_API_KEY to enable Google Places autocomplete.');
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setReadyState('ready');
      setMessage('');
    };
    script.onerror = () => {
      setReadyState('error');
      setMessage('Google Maps could not be loaded.');
    };

    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (readyState !== 'ready' || !inputRef.current || autocompleteRef.current || !window.google?.maps?.places?.Autocomplete) {
      return;
    }

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['establishment'],
      fields: ['place_id', 'name', 'formatted_address', 'geometry', 'types', 'vicinity'],
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();
      if (!place || !place.geometry) {
        return;
      }
      dispatch(selectPlaceAsync(place));
      inputRef.current.value = place.name || place.formatted_address || '';
    });
  }, [dispatch, readyState]);

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
        disabled={readyState !== 'ready'}
      />
      {message ? <div className="form-text mt-2">{message}</div> : null}
    </div>
  );
};

export default PlaceAutocomplete;
