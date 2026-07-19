import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places'];

const MapView = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const { currentPlace } = useSelector((state) => state.places);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    // Wait for the Google Maps script to be loaded
    if (!isLoaded || !mapRef.current || !window.google?.maps?.Map) {
      return;
    }

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 20.5937, lng: 78.9629 },
        zoom: 2,
      });
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !currentPlace || !mapInstanceRef.current || !window.google?.maps?.Marker) {
      return;
    }

    const position = { lat: currentPlace.lat, lng: currentPlace.lng };
    mapInstanceRef.current.panTo(position);
    mapInstanceRef.current.setZoom(14);

    if (!markerRef.current) {
      markerRef.current = new window.google.maps.Marker({
        map: mapInstanceRef.current,
        position,
      });
    } else {
      markerRef.current.setPosition(position);
    }
  }, [isLoaded, currentPlace]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return <div ref={mapRef} className="map-shell border shadow-sm" style={{ height: '100%', width: '100%' }} />;
};

export default MapView;
