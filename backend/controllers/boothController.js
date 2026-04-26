// Mock polling booths data
const boothsData = {
  Maharashtra: [
    {
      id: 1,
      name: "Government School Booth",
      address: "123 Main Street, Mumbai",
      state: "Maharashtra",
      latitude: 19.0760,
      longitude: 72.8777,
      hours: "7:00 AM - 6:00 PM",
      accessibilityFeatures: ["Wheelchair accessible", "Braille signage"]
    },
    {
      id: 2,
      name: "Community Center Booth",
      address: "456 Central Avenue, Pune",
      state: "Maharashtra",
      latitude: 18.5204,
      longitude: 73.8567,
      hours: "7:00 AM - 6:00 PM",
      accessibilityFeatures: ["Wheelchair accessible", "Audio assistance"]
    }
  ],
  Gujarat: [
    {
      id: 3,
      name: "City Hall Booth",
      address: "789 Democracy Square, Ahmedabad",
      state: "Gujarat",
      latitude: 23.0225,
      longitude: 72.5714,
      hours: "7:00 AM - 6:00 PM",
      accessibilityFeatures: ["Wheelchair accessible"]
    },
    {
      id: 4,
      name: "Public Library Booth",
      address: "321 Knowledge Park, Surat",
      state: "Gujarat",
      latitude: 21.1703,
      longitude: 72.8311,
      hours: "7:00 AM - 6:00 PM",
      accessibilityFeatures: ["Wheelchair accessible", "Braille signage", "Audio assistance"]
    }
  ],
  Karnataka: [
    {
      id: 5,
      name: "Education Hub Booth",
      address: "654 Technology Road, Bangalore",
      state: "Karnataka",
      latitude: 12.9716,
      longitude: 77.5946,
      hours: "7:00 AM - 6:00 PM",
      accessibilityFeatures: ["Wheelchair accessible"]
    },
    {
      id: 6,
      name: "Community Hall Booth",
      address: "987 Heritage Lane, Mysore",
      state: "Karnataka",
      latitude: 12.2958,
      longitude: 76.6394,
      hours: "7:00 AM - 6:00 PM",
      accessibilityFeatures: ["Wheelchair accessible", "Braille signage"]
    }
  ]
};

// Helper function to calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Get all polling booths
export const getAllBooths = (req, res) => {
  try {
    const allBooths = Object.values(boothsData).flat();
    res.status(200).json({
      success: true,
      message: 'All polling booths retrieved successfully',
      count: allBooths.length,
      data: allBooths
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get booths nearby (by coordinates)
export const getBoothsNearby = (req, res) => {
  try {
    const { lat, lng } = req.query;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusKm = 10; // Search radius in kilometers

    // Get all booths and filter by distance
    const allBooths = Object.values(boothsData).flat();
    
    const nearbyBooths = allBooths
      .map(booth => ({
        ...booth,
        distance: calculateDistance(latitude, longitude, booth.latitude, booth.longitude)
      }))
      .filter(booth => booth.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    if (nearbyBooths.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No booths found within ${radiusKm}km of the given location`
      });
    }

    res.status(200).json({
      success: true,
      message: `Found ${nearbyBooths.length} polling booths nearby`,
      count: nearbyBooths.length,
      searchRadius: radiusKm,
      userLocation: {
        latitude,
        longitude
      },
      data: nearbyBooths
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get booth by ID
export const getBoothById = (req, res) => {
  try {
    const { id } = req.params;
    const allBooths = Object.values(boothsData).flat();
    
    const booth = allBooths.find(b => b.id === parseInt(id));
    
    if (!booth) {
      return res.status(404).json({
        success: false,
        error: 'Booth not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Booth retrieved successfully',
      data: booth
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get booths by state
export const getBoothsByState = (req, res) => {
  try {
    const { state } = req.params;
    
    const booths = boothsData[state];
    
    if (!booths) {
      return res.status(404).json({
        success: false,
        error: `No booths found for state: ${state}`
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Polling booths for ${state} retrieved successfully`,
      count: booths.length,
      data: booths
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
