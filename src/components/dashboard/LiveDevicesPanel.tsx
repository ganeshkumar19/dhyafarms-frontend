import {
    Box,
    Flex,
    Text,
    HStack,
    Icon,
    Badge,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
    Grid,
    GridItem,
    IconButton,
  } from '@chakra-ui/react';
  import {
    FiCpu,
    FiDroplet,
    FiThermometer,
    FiActivity,
    FiChevronLeft,
    FiChevronRight,
  } from 'react-icons/fi';
  import { FaBatteryHalf, FaSignal, FaCloudRain } from 'react-icons/fa';
  import { WiHumidity } from 'react-icons/wi';
  import { formatDistanceToNow } from 'date-fns';
  import { useState } from 'react';
  import { useLiveSensorData } from '@/hooks/useLiveSensorData';
  import { AQISData, WSData } from '@/types/models';
  import { motion } from 'framer-motion';
  
  const MotionBox = motion(Box);
  
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
  }) => {
    const labelColor = useColorModeValue('gray.500', 'gray.400');
    const valueColor = critical ? 'red.400' : useColorModeValue('gray.800', 'gray.100');
    const iconColor = useColorModeValue('gray.500', 'gray.400');
  
    return (
      <GridItem minW="120px">
        <Stat>
          <Flex align="center" gap={2}>
            <Icon as={icon} boxSize={4} color={iconColor} />
            <StatLabel fontSize="xs" color={labelColor}>
              {label}
            </StatLabel>
          </Flex>
          <StatNumber fontSize="sm" color={valueColor}>
            {typeof value === 'number' ? `${value.toFixed(2)}${unit}` : 'NA'}
          </StatNumber>
        </Stat>
      </GridItem>
    );
  };
  
  const isCritical = (label: string, value: number | undefined): boolean => {
    if (label === 'DO' && value !== undefined && value < 3) return true;
    if (label === 'Ammonia' && value !== undefined && value > 0.2) return true;
    return false;
  };
  
  const LiveDevicesPanel = () => {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const textColor = useColorModeValue('gray.500', 'gray.400');
    const liveDataMap = useLiveSensorData();
    const deviceList = Object.values(liveDataMap);
  
    const [page, setPage] = useState(0);
    const pageSize = 3;
  
    const totalPages = Math.ceil(deviceList.length / pageSize);
    const currentDevices = deviceList.slice(page * pageSize, (page + 1) * pageSize);
  
    if (deviceList.length === 0) {
      return (
        <Box p={4} bg={cardBg} border="1px dashed" borderColor={borderColor} rounded="md">
          <Text fontSize="sm" color={textColor}>
            No live devices connected yet.
          </Text>
        </Box>
      );
    }
  
    return (
      <Box>
        {/* Pagination Controls */}
        <Flex justify="flex-end" mb={3} gap={2}>
          <IconButton
            aria-label="Prev"
            icon={<FiChevronLeft />}
            size="sm"
            variant="outline"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            isDisabled={page === 0}
          />
          <IconButton
            aria-label="Next"
            icon={<FiChevronRight />}
            size="sm"
            variant="outline"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            isDisabled={page >= totalPages - 1}
          />
        </Flex>
  
        <Flex gap={4} wrap="wrap">
          {currentDevices.map((device) => {
            const lastSeen = device.timestamp ? new Date(device.timestamp) : null;
            const isOffline =
              !device.timestamp || (lastSeen && Date.now() - lastSeen.getTime() > 2 * 60 * 1000);
  
            const isAQIS = device.type === 'aqis' && 'do_mg_l' in device.data;
            const isWS = device.type === 'weather' && 'air_temp_c' in device.data;
            const aqis = isAQIS ? (device.data as AQISData) : null;
            const ws = isWS ? (device.data as WSData) : null;
  
            return (
              <MotionBox
                key={device.device_id}
                width="320px"
                p={4}
                rounded="lg"
                shadow="md"
                border="1px solid"
                borderColor={borderColor}
                flexShrink={0}
                bg={cardBg}
                animate={{
                  boxShadow: isOffline
                    ? '0px 0px 0px rgba(0,0,0,0)'
                    : '0px 0px 12px rgba(72, 187, 120, 0.4)',
                }}
                transition={{ duration: 0.6 }}
              >
                {/* Header */}
                <Flex justify="space-between" align="center" mb={2}>
                  <HStack>
                    <Icon as={FiCpu} color={isOffline ? 'red.500' : 'green.500'} />
                    <Text fontWeight="semibold" fontSize="sm">
                      {device.device_id}
                    </Text>
                  </HStack>
                  <HStack>
                    <Badge colorScheme={isOffline ? 'red' : 'green'} fontSize="0.7rem">
                      {isOffline ? 'OFFLINE' : 'ONLINE'}
                    </Badge>
                    <Badge colorScheme="blue" fontSize="0.7rem">
                      {device.type.toUpperCase()}
                    </Badge>
                  </HStack>
                </Flex>
  
                {/* Last Seen */}
                {device.timestamp && (
                  <Text
                    fontSize="xs"
                    color={isOffline ? 'red.400' : textColor}
                    mb={2}
                  >
                    Updated {formatDistanceToNow(new Date(device.timestamp), { addSuffix: true })}
                  </Text>
                )}
  
                {/* Sensor Data */}
                <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                  {aqis && (
                    <>
                      <StatBlock label="DO" value={aqis.do_mg_l} unit=" mg/L" icon={FiDroplet} critical={isCritical('DO', aqis.do_mg_l)} />
                      <StatBlock label="Temp" value={aqis.temp_c} unit="°C" icon={FiThermometer} />
                      <StatBlock label="pH" value={aqis.ph} icon={FiActivity} />
                      <StatBlock label="Battery" value={aqis.battery_level} unit="%" icon={FaBatteryHalf} />
                      <StatBlock label="Signal" value={aqis.signal_strength} unit=" dBm" icon={FaSignal} />
                    </>
                  )}
                  {ws && (
                    <>
                      <StatBlock label="Air Temp" value={ws.air_temp_c} unit="°C" icon={FiThermometer} />
                      <StatBlock label="Humidity" value={ws.humidity_percent} unit="%" icon={WiHumidity} />
                      <StatBlock label="Rain" value={ws.rainfall_mm} unit=" mm" icon={FaCloudRain} />
                      <StatBlock label="Battery" value={ws.battery_level} unit="%" icon={FaBatteryHalf} />
                      <StatBlock label="Signal" value={ws.signal_strength} unit=" dBm" icon={FaSignal} />
                    </>
                  )}
                </Grid>
              </MotionBox>
            );
          })}
        </Flex>
      </Box>
    );
  };
  
  export default LiveDevicesPanel;