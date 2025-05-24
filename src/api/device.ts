import { useRegisterAuthStore } from '@/store/registerAuth';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Reusable type for a device record from /devices

const getAuthHeaders = () => {
  const token = useRegisterAuthStore.getState().token || localStorage.getItem('token');
  if (!token) {
    console.warn('🚫 No auth token found in localStorage');
  }
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface DeviceAPIResponse {
  deviceId: string;
  type: string;
  status: string;
  pondId: string;
  pondName: string;
  lastSeen: string;
  lastData: any;
  registeredAt: string;
}

// Used in POST /devices
export interface RegisterDevicePayload {
  deviceId: string;
  type: string;
  location: string;
  pondId: string;
  status: string;
  userId: string;
}

// Used in GET /devices/available
export interface AvailableDevice {
  id: string;
  deviceId: string;
}

// ✅ 1. Get All Devices with Last Seen
export const getDevices = async (userId: string): Promise<DeviceAPIResponse[]> => {
  console.log('running api');
  if (!userId) {
    console.warn('No userId provided.');
    return [];
  }

  console.log(userId);

  try {
    const response = await axios.get<DeviceAPIResponse[]>(
      `${BASE_URL}/devices/user/${userId}`,
      { headers: getAuthHeaders() }
    );

    console.log('response', response);

    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.warn('Unexpected data format from API.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching devices:', error);
    return [];
  }
};


// 2. Get Unassigned Devices
export const getAvailableDevices = async (): Promise<AvailableDevice[]> => {
  const response = await axios.get<{ success?: boolean; data: AvailableDevice[] }>(
    `${BASE_URL}/devices/available`,
    { headers: getAuthHeaders() }
  );
  return response.data.data || [];
};

// 3. Register a New Device
export const registerDevice = async (deviceData: RegisterDevicePayload) => {
  const response = await axios.post(`${BASE_URL}/devices`, deviceData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// 4. Update a Device by ID
export const updateDevice = async (
  deviceId: string,
  updateData: Partial<RegisterDevicePayload>
) => {
  const response = await axios.put(`${BASE_URL}/devices/${deviceId}`, updateData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// 5. Delete a Device by ID
export const deleteDevice = async (deviceId: string) => {
  const response = await axios.delete(`${BASE_URL}/devices/${deviceId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// 6. Fetch Weather Data
export const fetchWeatherData = async (
  activeFarmId: string,
  startDate: string,
  endDate: string
) => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.get(`${BASE_URL}/weather/trends/farm/${activeFarmId}`, {
      params: { startDate, endDate },
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
