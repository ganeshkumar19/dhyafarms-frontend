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
import { AQISData, WSData } from '../../types/models';

interface DeviceLiveCardProps {
  deviceId: string;
  status: string;
  liveData?: AQISData | WSData | Record<string, any>;
  timestamp?: string;
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
      bg="cardBg"
      borderRadius="2xl"
      shadow="md"
      border="1px solid"
      borderColor="cardBorder"
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
        <Text fontSize="xs" color={isOffline ? 'red.500' : "subTextColor"} mb={2}>
          Updated {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
        </Text>
      )}

      {liveData ? (
        <Grid templateColumns="repeat(2, 1fr)" gap={4} fontSize="sm">
          {aqis && (
            <>
              <StatBlock label="DO" value={aqis.do_mg_l} unit=" mg/L" icon={FaWater} critical={isCritical('DO', aqis.do_mg_l)} iconColor="iconColor" />
              <StatBlock label="pH" value={aqis.ph} icon={FaWater} iconColor="iconColor" />
              <StatBlock label="Temp" value={aqis.temp_c} unit="°C" icon={FaThermometerHalf} iconColor="iconColor" />
              <StatBlock label="Ammonia" value={aqis.ammonia} icon={FaWater} critical={isCritical('Ammonia', aqis.ammonia)} iconColor="iconColor" />
              <StatBlock label="Nitrite" value={aqis.nitrite} icon={FaWater} iconColor="iconColor" />
              <StatBlock label="Nitrate" value={aqis.nitrate} icon={FaWater} iconColor="iconColor" />
              <StatBlock label="Salinity" value={aqis.salinity} icon={FaWater} iconColor="iconColor" />
              <StatBlock label="Turbidity" value={aqis.turbidity} icon={FaWater} iconColor="iconColor" />
              <StatBlock label="TDS" value={aqis.tds} icon={FaWater} iconColor="iconColor" />
              <StatBlock label="ORP" value={aqis.orp} icon={FaWater} iconColor="iconColor" />
              <StatBlock label="Chlorine" value={aqis.chlorine} icon={FaWater} iconColor="iconColor" />
              <StatBlock label="Water Level" value={aqis.water_level} icon={FaWater} iconColor="iconColor" />
              <StatBlock label="Battery" value={aqis.battery_level} unit="%" icon={FaBatteryHalf} iconColor="iconColor" />
              <StatBlock label="Signal" value={aqis.signal_strength} unit=" dBm" icon={FaSignal} iconColor="iconColor" />
            </>
          )}

          {ws && (
            <>
              <StatBlock label="Air Temp" value={ws.air_temp_c} unit="°C" icon={FaThermometerHalf} iconColor="iconColor" />
              <StatBlock label="Humidity" value={ws.humidity_percent} unit="%" icon={WiHumidity} iconColor="iconColor" />
              <StatBlock label="Wind" value={ws.wind_speed_mps} unit=" m/s" icon={FaWind} iconColor="iconColor" />
              <StatBlock label="Wind Dir" value={ws.wind_direction_deg} unit="°" icon={FaWind} iconColor="iconColor" />
              <StatBlock label="Solar Rot" value={ws.solar_rotation_deg} unit="°" icon={WiDaySunny} iconColor="iconColor" />
              <StatBlock label="UVI" value={ws.uvi_index} icon={WiDaySunny} iconColor="iconColor" />
              <StatBlock label="Light" value={ws.light_intensity_lux} unit=" lux" icon={WiDaySunny} iconColor="iconColor" />
              <StatBlock label="Pressure" value={ws.baro_pressure_hpa} unit=" hPa" icon={WiDaySunny} iconColor="iconColor" />
              <StatBlock label="Rain" value={ws.rainfall_mm} unit=" mm" icon={FaCloudRain} iconColor="iconColor" />
              <StatBlock label="Battery" value={ws.battery_level} unit="%" icon={FaBatteryHalf} iconColor="iconColor" />
              <StatBlock label="Signal" value={ws.signal_strength} unit=" dBm" icon={FaSignal} iconColor="iconColor" />
            </>
          )}
        </Grid>
      ) : (
        <Text fontSize="sm" color="subTextColor">
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
  iconColor: string;
}) => (
  <GridItem>
    <Stat>
      <Flex align="center" gap={2}>
        <Icon as={icon} boxSize={4} color="iconColor" />
        <StatLabel fontSize="xs" color="iconColor">
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