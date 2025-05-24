// src/hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';

const WS_URL = import.meta.env.VITE_API_WS_URL || 'ws://localhost:3000/ws/dashboard';

export function useWebSocket(onMessage: (data: any) => void) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ Connected to dashboard WebSocket');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.warn('⚠️ Invalid WS message:', event.data);
      }
    };

    ws.onerror = (err) => {
      console.error('❌ WebSocket error:', err);
    };

    ws.onclose = () => {
      console.warn('🔌 WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, [onMessage]);
}