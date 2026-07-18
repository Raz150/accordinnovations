import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const MapView = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const { currentPlace } = useSelector((state) => state.places);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps?.Map) {
      return;
    }

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 20.5937, lng: 78.9629 },
        zoom: 2,
      });
    }
  }, []);

  useEffect(() => {
    if (!currentPlace || !mapInstanceRef.current || !window.google?.maps?.Marker) {
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
  }, [currentPlace]);

  return <div ref={mapRef} className="map-shell border shadow-sm" />;
};

export default MapView;
