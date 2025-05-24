import axios from 'axios';

export interface LocationData {
  location: string;
  lat: string;
  long: string;
}

export const fetchLocation = async (): Promise<LocationData | null> => {
  try {
    const res = await axios.get('https://ipapi.co/json/');
    console.log(res.data)
    const locationStr = `${res.data.city}, ${res.data.region}, ${res.data.country_name}`;

    return {
      location: locationStr,
      lat: String(res.data.latitude),
      long: String(res.data.longitude),
    };
  } catch (error) {
    console.warn('⚠️ Failed to fetch location:', error);
    return null;
  }
};