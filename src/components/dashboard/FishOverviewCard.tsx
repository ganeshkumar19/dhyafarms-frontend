import {
    Box,
    Heading,
    Text,
    Stack,
    Flex,
    Icon,
  } from '@chakra-ui/react';
  import { FiAlertTriangle, FiInfo } from 'react-icons/fi';
  import { useTranslation } from 'react-i18next';
  
  interface FishOverviewCardProps {
    lastFed: string; // ISO string
    species: string; // Can be "Rohu (Labeo rohita)" or just "Rohu"
    feedToday: number; // e.g. "18 kg"
    fcr: number;
    growthRate: number; // e.g. "1.2"
    daysInCycle: number;
    totalStock: number;
    avgWeight: number; // e.g. "350g"
    alertMessage?: string;
    insightMessage?: string;
  }
  
  const FishOverviewCard = ({
    lastFed,
    species,
    feedToday,
    fcr,
    growthRate,
    daysInCycle,
    totalStock,
    avgWeight,
    alertMessage,
    insightMessage,
  }: FishOverviewCardProps) => {
    

    const { t } = useTranslation('fishoverview');
  
  
    return (
      <Box
        bg="deviceCardBg"
        border="1px solid"
        borderColor="cardBorder"
        p={5}
        borderRadius="lg"
        shadow="md"
        w="full"
      >
        <Stack spacing={2}>
        <Heading size="sm">{t('fishOverview')}</Heading>
  
          <Text fontSize="xs" color="gray.500">
            {lastFed}
          </Text>
  
          <Stack spacing={1} fontSize="sm">
            <Flex justify="space-between">
              <Text fontSize='14px'>
                <strong>{t('species', { name: species || 'NA' })}</strong>
              </Text>
              <Text>
                <strong>{t('feedToday', { kg: feedToday || '--' })}</strong>
              </Text>
            </Flex>
  
            <Flex justify="space-between">
              <Text fontSize='14px'>
                <strong>{t('fcr', { value: Number.isFinite(fcr) ? fcr.toFixed(2) : '--' })}</strong>
              </Text>
              <Text>
              <strong>{t('growthRate', { value: growthRate ? growthRate.toFixed(3) : '--' })}</strong>
              </Text>
            </Flex>
  
            <Flex justify="space-between">
              <Text>
                <strong>{t('daysInCycle', { days: Number.isFinite(daysInCycle) ? daysInCycle : '--' })}</strong> 
              </Text>
              <Text>
              <strong>
              {t('totalStock', { count: totalStock ?? 0 })}
              </strong>
              </Text>
            </Flex>
  
            <Text>
              <strong>{t('avgWeight', { weight: avgWeight || '--' })}</strong>
            </Text>
          </Stack>
  
          {alertMessage && (
            <Box
              mt={3}
              p={3}
              bg="red.50"
              borderRadius="md"
              border="1px solid"
              borderColor="red.200"
            >
              <Flex align="center" gap={2}>
                <Icon as={FiAlertTriangle} color="red.500" />
                <Text fontSize="sm" color="red.700">
                  <strong>Alert:</strong> {alertMessage}
                </Text>
              </Flex>
            </Box>
          )}
  
          {insightMessage && (
            <Box
              mt={2}
              p={3}
              bg="blue.50"
              borderRadius="md"
              border="1px solid"
              borderColor="blue.200"
            >
              <Flex align="center" gap={2}>
                <Icon as={FiInfo} color="blue.600" />
                <Text fontSize="sm" color="blue.700">
                  <strong>Insights:</strong> {insightMessage}
                </Text>
              </Flex>
            </Box>
          )}
        </Stack>
      </Box>
    );
  };
  
  export default FishOverviewCard;