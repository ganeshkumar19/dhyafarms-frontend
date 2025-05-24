// src/components/DeviceLiveCard.tsx
import {
  Box,
  Text,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  Badge,
  Flex,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import {
  FaWater,
  FaThermometerHalf,
  FaBatteryHalf,
  FaSignal,
  FaWind,
  FaCloudRain,
} from 'react-icons/fa';
import { WiHumidity, WiDaySunny } from 'react-icons/wi';
import { formatDistanceToNow } from 'date-fns';
import { AQISData, WSData } from '../types/models';

interface DeviceLiveCardProps {
  deviceId: string;
  status: string; // backend status: 'active', 'offline', etc.
  liveData?: AQISData | WSData | Record<string, any>;
  timestamp?: string; // lastSeen from backend
}

const isCritical = (label: string, value: number | undefined): boolean => {
  if (label === 'DO' && value !== undefined && value < 3) return true;
  if (label === 'Ammonia' && value !== undefined && value > 0.2) return true;
  return false;
};

const DeviceLiveCard: React.FC<DeviceLiveCardProps> = ({
  deviceId,
  liveData,
  timestamp,
}) => {
  const isAQIS = deviceId.startsWith('AQIS');
  const isWS = deviceId.startsWith('WS');
  const aqis = isAQIS ? (liveData as AQISData) : null;
  const ws = isWS ? (liveData as WSData) : null;
  const cardBg = useColorModeValue('white', 'gray.800');

  const now = new Date();
  const updatedAt = timestamp ? new Date(timestamp) : null;
  const minutesSinceUpdate = updatedAt
    ? Math.floor((now.getTime() - updatedAt.getTime()) / 60000)
    : null;

  const isOffline = !timestamp || (minutesSinceUpdate !== null && minutesSinceUpdate > 2);

  return (
    <Box
      maxW="sm"
      w="full"
      p={4}
      bg={cardBg}
      borderRadius="2xl"
      shadow="md"
      border="1px solid"
      borderColor="gray.200"
    >
      <Flex justify="space-between" mb={2} align="center">
        <Text fontWeight="bold" fontSize="md">
          {deviceId}
        </Text>
        <Badge colorScheme={isOffline ? 'red' : 'green'}>
          {isOffline ? 'OFFLINE' : 'ONLINE'}
        </Badge>
      </Flex>

      {timestamp && (
        <Text fontSize="xs" color={isOffline ? 'red.500' : 'gray.500'} mb={2}>
          Updated {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
        </Text>
      )}

      {liveData ? (
        <Grid templateColumns="repeat(2, 1fr)" gap={4} fontSize="sm">
          {aqis && (
            <>
              <StatBlock label="DO" value={aqis.do_mg_l} unit=" mg/L" icon={FaWater} critical={isCritical('DO', aqis.do_mg_l)} />
              <StatBlock label="pH" value={aqis.ph} icon={FaWater} />
              <StatBlock label="Temp" value={aqis.temp_c} unit="°C" icon={FaThermometerHalf} />
              <StatBlock label="Ammonia" value={aqis.ammonia} icon={FaWater} critical={isCritical('Ammonia', aqis.ammonia)} />
              <StatBlock label="Nitrite" value={aqis.nitrite} icon={FaWater} />
              <StatBlock label="Nitrate" value={aqis.nitrate} icon={FaWater} />
              <StatBlock label="Salinity" value={aqis.salinity} icon={FaWater} />
              <StatBlock label="Turbidity" value={aqis.turbidity} icon={FaWater} />
              <StatBlock label="TDS" value={aqis.tds} icon={FaWater} />
              <StatBlock label="ORP" value={aqis.orp} icon={FaWater} />
              <StatBlock label="Chlorine" value={aqis.chlorine} icon={FaWater} />
              <StatBlock label="Water Level" value={aqis.water_level} icon={FaWater} />
              <StatBlock label="Battery" value={aqis.battery_level} unit="%" icon={FaBatteryHalf} />
              <StatBlock label="Signal" value={aqis.signal_strength} unit=" dBm" icon={FaSignal} />
            </>
          )}

          {ws && (
            <>
              <StatBlock label="Air Temp" value={ws.air_temp_c} unit="°C" icon={FaThermometerHalf} />
              <StatBlock label="Humidity" value={ws.humidity_percent} unit="%" icon={WiHumidity} />
              <StatBlock label="Wind" value={ws.wind_speed_mps} unit=" m/s" icon={FaWind} />
              <StatBlock label="Wind Dir" value={ws.wind_direction_deg} unit="°" icon={FaWind} />
              <StatBlock label="Solar Rot" value={ws.solar_rotation_deg} unit="°" icon={WiDaySunny} />
              <StatBlock label="UVI" value={ws.uvi_index} icon={WiDaySunny} />
              <StatBlock label="Light" value={ws.light_intensity_lux} unit=" lux" icon={WiDaySunny} />
              <StatBlock label="Pressure" value={ws.baro_pressure_hpa} unit=" hPa" icon={WiDaySunny} />
              <StatBlock label="Rain" value={ws.rainfall_mm} unit=" mm" icon={FaCloudRain} />
              <StatBlock label="Battery" value={ws.battery_level} unit="%" icon={FaBatteryHalf} />
              <StatBlock label="Signal" value={ws.signal_strength} unit=" dBm" icon={FaSignal} />
            </>
          )}
        </Grid>
      ) : (
        <Text fontSize="sm" color="gray.500">
          No data available.
        </Text>
      )}
    </Box>
  );
};

const StatBlock = ({
  label,
  value,
  unit = '',
  icon,
  critical = false,
}: {
  label: string;
  value: number | undefined;
  unit?: string;
  icon: any;
  critical?: boolean;
}) => (
  <GridItem>
    <Stat>
      <Flex align="center" gap={2}>
        <Icon as={icon} boxSize={4} color="gray.500" />
        <StatLabel fontSize="xs" color="gray.500">
          {label}
        </StatLabel>
      </Flex>
      <StatNumber fontSize="sm" color={critical ? 'red.500' : undefined}>
        {typeof value === 'number' ? `${value.toFixed(2)}${unit}` : 'NA'}
      </StatNumber>
    </Stat>
  </GridItem>
);

export default DeviceLiveCard;