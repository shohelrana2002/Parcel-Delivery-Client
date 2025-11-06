import React, { useEffect } from "react";
import { useMap } from "react-leaflet";

const MapActions = ({ flyTo, bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (flyTo) {
      // single result -> smooth fly
      map.flyTo([flyTo.latitude, flyTo.longitude], 12, {
        animate: true,
        duration: 1.2,
      });
    } else if (bounds && bounds.isValid()) {
      // multiple -> fit bounds
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [flyTo, bounds, map]);
  return null;
};

export default MapActions;
