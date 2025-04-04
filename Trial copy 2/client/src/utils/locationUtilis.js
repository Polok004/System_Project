const BANGLADESH_BOUNDS = {
    minLat: 20.7,
    maxLat: 26.6,
    minLng: 88.0,
    maxLng: 92.7,
  };
  
  export const getCoordinatesAndAmenities = async (address) => {
    try {
      // Append "Bangladesh" to the address if not present
      const fullAddress = address.toLowerCase().includes('bangladesh') 
        ? address 
        : `${address}, Bangladesh`;
  
      // Get coordinates
      const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`;
      const response = await fetch(searchUrl);
      const data = await response.json();
  
      if (!data.length) {
        throw new Error('Address not found');
      }
  
      const { lat, lon } = data[0];
  
      // Validate coordinates are within Bangladesh
      if (lat < BANGLADESH_BOUNDS.minLat || lat > BANGLADESH_BOUNDS.maxLat ||
          lon < BANGLADESH_BOUNDS.minLng || lon > BANGLADESH_BOUNDS.maxLng) {
        throw new Error('Address must be within Bangladesh');
      }
  
      // Search for nearby amenities
      const amenities = await Promise.all([
        getNearbyAmenities(lat, lon, 'bus_station', 'bus'),
        getNearbyAmenities(lat, lon, 'school', 'school'),
        getNearbyAmenities(lat, lon, 'restaurant', 'restaurant')
      ]);
  
      return {
        latitude: lat,
        longitude: lon,
        bus: amenities[0],
        school: amenities[1],
        restaurant: amenities[2]
      };
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  
  const getNearbyAmenities = async (lat, lon, amenityType, type) => {
    try {
      const radius = 1000; // 1km radius
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="${amenityType}"](around:${radius},${lat},${lon});
        );
        out body;
      `;
  
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      });
  
      const data = await response.json();
      
      // Count amenities within different ranges
      const count = data.elements.reduce((acc, element) => {
        const distance = calculateDistance(lat, lon, element.lat, element.lon);
        if (distance <= 1) return acc + 1; // within 1km
        return acc;
      }, 0);
  
      return count;
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      return 0;
    }
  };
  
  // Calculate distance between two points in kilometers
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };
  export default getCoordinatesAndAmenities;