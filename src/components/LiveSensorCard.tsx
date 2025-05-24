import { Box, Text, Heading, Badge, Code } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

interface LiveSensorData {
  device_id: string;
  type: 'aqis' | 'weather' | 'drone';
  data: Record<string, any>;
  timestamp: string;
}

export default function LiveSensorCard() {
  const [filter, setFilter] = useState<'all' | 'aqis' | 'weather' | 'drone'>('all');
  const [_, forceUpdate] = useState(0); // for UI refresh
  const dataMap = useRef<Map<string, LiveSensorData>>(new Map());

  useEffect(() => {
    const ws = new WebSocket('wss://dhya-farms-api-latest.onrender.com/ws/dashboard');

    ws.onopen = () => console.log('✅ Connected to live data feed');

    ws.onmessage = (event) => {
      try {
        const msg: LiveSensorData = JSON.parse(event.data);
        if (msg.device_id && msg.data?.isLive) {
          // update map
          dataMap.current.set(msg.device_id, msg);
          forceUpdate((n) => n + 1); // force refresh
        }
      } catch (err) {
        console.warn('⚠️ Invalid WebSocket message', err);
      }
    };

    ws.onclose = () => console.warn('🔌 Live socket closed');
    ws.onerror = (err) => console.error('❌ Live socket error', err);

    return () => ws.close();
  }, []);

  const filteredData = Array.from(dataMap.current.values()).filter(
    (entry) => filter === 'all' || entry.type === filter
  );

  return (
    <Box bg="white" p={4} borderRadius="md" shadow="sm" maxW="800px" mx="auto">
      <Heading size="md" mb={4}>📡 Live Sensor Feed</Heading>

      <Box mb={4} textAlign="center">
        {['all', 'aqis', 'weather', 'drone'].map((t) => (
          <Badge
            key={t}
            cursor="pointer"
            mx={1}
            colorScheme={filter === t ? 'blue' : 'gray'}
            onClick={() => setFilter(t as any)}
          >
            {t.toUpperCase()}
          </Badge>
        ))}
      </Box>

      {filteredData.map((entry) => (
        <Box key={entry.device_id} borderWidth="1px" borderRadius="md" p={4} mb={3}>
          <Heading size="sm">{entry.device_id}</Heading>
          <Badge colorScheme="green" mt={1} mb={3}>{entry.type.toUpperCase()}</Badge>
          <Code display="block" fontSize="sm" whiteSpace="pre-wrap" bg="gray.50" p={3}>
            {JSON.stringify(entry.data, null, 2)}
          </Code>
          <Text fontSize="xs" color="gray.400" mt={2}>
            {new Date(entry.timestamp).toLocaleTimeString()}
          </Text>
        </Box>
      ))}
    </Box>
  );
}