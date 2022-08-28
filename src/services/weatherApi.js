import axios from "axios";

export async function fetchCurrentWeather(apiKey, { latitude, longitude } = {}) {
  const query =
    latitude != null && longitude != null
      ? `${latitude},${longitude}`
      : "auto:ip";

  const response = await axios.get(
    `https://api.weatherapi.com/v1/current.json`,
    {
      params: {
        key: apiKey,
        q: query,
        aqi: "no",
      },
    }
  );

  return {
    description: response.data.current.condition.text,
    locationName: response.data.location?.name,
  };
}

export function getBrowserPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(error),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
    );
  });
}
