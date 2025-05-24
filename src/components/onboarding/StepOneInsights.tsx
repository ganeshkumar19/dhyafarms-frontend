import {
    Box,
    HStack,
    Stack,
    Text,
  } from '@chakra-ui/react';
  import { FiDroplet } from 'react-icons/fi';
  import { BsSun, BsCloudRain } from 'react-icons/bs';
  import StepProgressBar from './StepProgressBar';
  import { useTranslation } from 'react-i18next';


const StepOneInsights = () => {
  const { t } = useTranslation('step1');

  const locationPoints = t('locationHelpPoints', { returnObjects: true }) as string[];

  return (
    <Stack spacing={6}>
      {/* Step Progress */}
      <StepProgressBar step={1} total={5} />

      {/* Why Location is Important */}
      <Box bg="cardBg" p={4} rounded="md" shadow="sm">
        <Text fontWeight="semibold" mb={2}>
          📍 {t('locationHeading')}
        </Text>

        <Text fontSize="sm" color="textColor">
          {t('locationHelpTitle')}
          <br />
          {locationPoints.map((point, idx) => (
            <Box as="span"  key={idx}>- {point}</Box>
          ))}
          <br />
          {t('locationHelpDesc')}
        </Text>
      </Box>

      {/* Sample Forecast Example */}
      <Box bg="cardBg" p={4} rounded="md" shadow="sm">
        <Text fontSize="sm" fontWeight="bold" mb={2}>
          {t('sampleLocationTitle')}
        </Text>

        <Stack spacing={2}>
          <HStack fontSize="sm">
            <BsSun />
            <Text>{t('weatherForecast')}</Text>
          </HStack>
          <HStack fontSize="sm">
            <BsCloudRain />
            <Text>{t('rainfallForecast')}</Text>
          </HStack>
          <HStack fontSize="sm">
            <FiDroplet />
            <Text color="green.500" fontWeight="semibold">
              {t('waterAdvisory')}
            </Text>
          </HStack>
        </Stack>
      </Box>
    </Stack>
  );
};

export default StepOneInsights;