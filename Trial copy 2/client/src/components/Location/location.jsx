import { useState, useEffect } from "react";
import "./location.scss";

function LocationDisplay() {
  const [location, setLocation] = useState("Loading location...");
  const [error, setError] = useState(null);

  useEffect(() => {
    let watchId;

    const getLocationName = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        const cityArea = data.address.suburb || data.address.city || data.address.town;
        const city = data.address.city || data.address.town || data.address.state;
        setLocation(`${cityArea}, ${city}`);
      } catch (err) {
        setError("Unable to fetch location name");
      }
    };

    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getLocationName(latitude, longitude);
        },
        (err) => {
          setError("Unable to retrieve location");
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setError("Geolocation is not supported");
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return (
    <div className="location-display">
      <img src="/location-icon.png" alt="Location" className="location-icon" />
      {error ? <span className="error">{error}</span> : <span>{location}</span>}
    </div>
  );
}

export default LocationDisplay;