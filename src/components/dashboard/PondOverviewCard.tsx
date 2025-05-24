import {
    Box,
    Flex,
    Heading,
    Text,
    Stack,
    Icon,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { FiThermometer, FiDroplet, FiAlertCircle } from 'react-icons/fi';
  import type { IconType } from 'react-icons';
  import { useTranslation } from 'react-i18next';
  import { Spinner } from '@chakra-ui/react';
  
  interface PondOverviewCardProps {
    totalPonds: number;
    totalDevices: number;
    avgDO: number | null | undefined;
    avgTemp: number | null | undefined;
    lastUpdated: string;
    alertMessage?: string;
    insightMessage?: string;
    isLoading: boolean;
    isError: boolean;  
    error: any;
  }

  
  
  const PondOverviewCard = ({
    totalPonds,
    totalDevices,
    avgDO,
    avgTemp,
    lastUpdated,
    alertMessage,
    insightMessage,
    isLoading,  
    isError,
    error
  }: PondOverviewCardProps) => {
    const { t } = useTranslation('pondoverview');
    const bg = useColorModeValue('white', 'gray.800');
    const border = useColorModeValue('gray.200', 'gray.600');


    if (isLoading) {
      return (
        <Box width='100%' display='flex' alignItems='center' justifyContent='center' p={5}>
           <Spinner />;
        </Box>
      );
    }
    
    if (isError) {
      if (error?.response?.status === 404) {
        return (
          <Box p={5} borderRadius="md" bg="yellow.50" border="1px solid" borderColor="yellow.200">
            <Text color="yellow.800">
              No ponds are currently linked to this farm.
            </Text>
          </Box>
        );
      }
    
      return (
        <Box p={5}>
          <Text color="red.500">Failed to load data.</Text>
        </Box>
      );
    }
    
  
    return (
      <Box
        bg={bg}
        border="1px solid"
        borderColor={border}
        p={5}
        borderRadius="lg"
        shadow="md"
        w="full"
      >
        <Stack spacing={2}>
           <Heading size="sm">{t('pondOverview')}</Heading>
  
          <Text fontSize="xs" color="gray.500">
            {lastUpdated}
          </Text>
  
          <Flex gap={4} mt={2}>
            <StatBox
              icon={FiDroplet}
              label={t('avgDO')}
              value={
                typeof avgDO === 'number'
                  ? `${avgDO.toFixed(2)} mg/L`
                  : 'NA'
              }
            />
            <StatBox
              icon={FiThermometer}
              label={t('avgTemp')}
              value={
                typeof avgTemp === 'number'
                  ? `${avgTemp.toFixed(1)} °C`
                  : 'NA'
              }
            />
          </Flex>
  
          <Text fontSize="sm" mt={2}>
          {t('totalPondsDevices', {
            ponds: totalPonds,
            devices: totalDevices,
          })}
          </Text>
  
          {alertMessage && (
            <Box
              mt={2}
              p={3}
              bg="red.50"
              borderRadius="md"
              border="1px solid"
              borderColor="red.200"
            >
              <Flex align="center" gap={2}>
                <Icon as={FiAlertCircle} color="red.500" />
                <Text fontSize="sm" color="red.700">
                  <strong>Alert:</strong> {alertMessage}
                </Text>
              </Flex>
            </Box>
          )}
  
          {insightMessage && (
            <Box
              mt={1}
              p={3}
              bg="green.50"
              borderRadius="md"
              border="1px solid"
              borderColor="green.200"
            >
              <Text fontSize="sm" color="green.700">
                <strong>Insights:</strong> {insightMessage}
              </Text>
            </Box>
          )}
        </Stack>
      </Box>
    );
  };
  
  export default PondOverviewCard;
  
  interface StatBoxProps {
    icon: IconType;
    label: string;
    value: string;
  }
  
  const StatBox = ({ icon, label, value }: StatBoxProps) => (
    <Flex align="center" gap={2}>
      <Icon as={icon} boxSize={4} color="gray.500" />
      <Box>
        <Text fontSize="xs" color="gray.500">
          {label}
        </Text>
        <Text fontSize="sm" fontWeight="semibold">
          {value}
        </Text>
      </Box>
    </Flex>
  );