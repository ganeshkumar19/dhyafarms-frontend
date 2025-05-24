import { useEffect, useState } from 'react';
import { getDevices } from '../api/device';
import { LiveData } from '../types/models';
import { DeviceAPIResponse } from '../api/device';
import { useAuthStore } from './useAuthStore';

export function useLiveSensorData(): Record<string, LiveData> {
  const [liveDataMap, setLiveDataMap] = useState<Record<string, LiveData>>({});
  const { user } = useAuthStore();

  useEffect(() => {
    let ws: WebSocket;

    const initialize = async () => {
      try {
        // Step 1: Fetch fallback device data
        const devices: DeviceAPIResponse[] = await getDevices(user?.id || '');

        const fallbackMap: Record<string, LiveData> = {};
        devices.forEach((device) => {
          if (device.lastData) {
            fallbackMap[device.deviceId] = {
              device_id: device.deviceId,
              type: device.type as 'aqis' | 'weather' | 'drone', // ✅ include type
              timestamp: device.lastSeen,
              data: device.lastData,
            };
          }
        });

        setLiveDataMap(fallbackMap);

        // Step 2: Open WebSocket connection
        ws = new WebSocket('wss://dhya-farms-api-latest.onrender.com/ws/hub');

        ws.onopen = () => {
          console.log('✅ Connected to WebSocket');
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);

            if (message.device_id && message.data && message.type) {
              setLiveDataMap((prev) => ({
                ...prev,
                [message.device_id]: message as LiveData,
              }));
            }
          } catch (err) {
            console.warn('⚠️ Invalid WebSocket data:', event.data);
          }
        };

        ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
        };

        ws.onclose = () => {
          console.warn('🔌 WebSocket disconnected');
        };
      } catch (err) {
        console.error('❌ Failed to load fallback device data:', err);
      }
    };

    initialize();

    return () => {
      ws?.close();
    };
  }, []);

  return liveDataMap;
}