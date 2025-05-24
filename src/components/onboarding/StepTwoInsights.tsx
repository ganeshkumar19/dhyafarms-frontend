import { Box, Heading, Stack, Text } from '@chakra-ui/react';
import StepProgressBar from './StepProgressBar';
import { useTranslation } from 'react-i18next';
import { useStepTwoFormStore } from '@/store/stepTwoFormStore';
import { useRegisterAuthStore } from '@/store/registerAuth';

const StepTwoInsights = () => {
  const { t } = useTranslation('step2');

  // Pull live data from Zustand
  const {
    farmName,
    farmSize,
    farmType,
    waterSource,
  } = useStepTwoFormStore();

  // Static value from localStorage (only loaded once)
  const form = useRegisterAuthStore((state) => state.formData);
  const location = form?.location || '—';
  return (
    <Stack spacing={4}>
      {/* Step Progress */}
      <StepProgressBar step={2} total={5} />

      {/* Purpose */}
      <Box fontSize="sm" color="mutedText">
        <Text fontWeight="medium">{t("farmInfoHeading")}</Text>
        <Text mt={1}>{t("farmInfoDesc")}</Text>
      </Box>

      {/* Preview Box */}
      <Box
        bg="cardBg"
        p={4}
        rounded="md"
        border="1px solid"
        borderColor="borderColor"
      >
        <Heading size="sm" mb={2}>
          {t("farmInfoTitle")}
        </Heading>
        <Stack spacing={1} fontSize="sm">
          <Text><strong>{t("farmName")}:</strong> {farmName || '—'}</Text>
          <Text><strong>{t("farmLocation")}:</strong> {location}</Text>
          <Text><strong>{t("farmType")}:</strong> {farmType || '—'}</Text>
          <Text><strong>{t("waterSource")}:</strong> {waterSource || '—'}</Text>
          <Text><strong>{t("farmSize")}:</strong> {farmSize || '—'}</Text>
        </Stack>
      </Box>
    </Stack>
  );
};

export default StepTwoInsights;
