import {
  Box,
  Heading,
  List,
  ListItem,
  Stack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRegisterAuthStore } from '@/store/registerAuth';
import { usePondFormStore } from '@/store/pondFarmStore';
import { useTranslation } from 'react-i18next';

type Summary = {
  fullName: string;
  location: string;
  farmCount: number;
  pondCount: number;
  deviceCount: number;
  manualEntry: boolean;
};

const StepFiveChecklist = () => {
  const { t } = useTranslation('step5');
  const [summary, setSummary] = useState<Summary>({
    fullName: '',
    location: '',
    farmCount: 1,
    pondCount: 0,
    deviceCount: 0,
    manualEntry: false,
  });

  // Pull Step 1 form data from auth store
  const formData = useRegisterAuthStore((state) => state.formData);

  // Pull Step 3 data (ponds) from pond store
  const pondList = usePondFormStore((state) => state.pondList);

  useEffect(() => {
    const pondCount = pondList.length;
    const deviceCount = pondList.reduce((acc, pond) => acc + (pond.deviceIds?.length || 0), 0);
    const manualEntry = pondList.some((pond) => pond.monitoring === 'manual');

    setSummary({
      fullName: formData?.fullName || 'Unknown User',
      location: formData?.location || '—',
      farmCount: 1,
      pondCount,
      deviceCount,
      manualEntry,
    });
  }, [formData, pondList]);

  return (
    <Stack spacing={4}>
      <Heading size="sm" color="textColor">
        {t('checklist.heading')}
      </Heading>
      <Box
        bg="cardBg"
        p={4}
        rounded="md"
        border="1px solid"
        borderColor="borderColor"
        color="textColor"
      >
        <List spacing={2} fontSize="sm">
          <ListItem>
            👤 <strong>{t('checklist.registeredAs')}:</strong> {summary.fullName}
          </ListItem>
          <ListItem>
            📍 <strong>{t('checklist.location')}:</strong> {summary.location}
          </ListItem>
          <ListItem>
            🏡 <strong>{t('checklist.farms')}:</strong> {summary.farmCount},{' '}
            <strong>{t('checklist.ponds')}:</strong> {summary.pondCount}{' '}
            {summary.pondCount === 1 ? t('checklist.pondSingular') : t('checklist.pondPlural')}
          </ListItem>
          <ListItem>
            🛰️ <strong>{t('checklist.devicesLinked')}:</strong> {summary.deviceCount}{' '}
            {summary.deviceCount === 1 ? t('checklist.deviceSingular') : t('checklist.devicePlural')}
          </ListItem>
          <ListItem>
            📝 <strong>{t('checklist.manualEntry')}:</strong>{' '}
            {summary.manualEntry ? t('checklist.enabled') : t('checklist.disabled')}
          </ListItem>
        </List>
      </Box>
    </Stack>
  );
};

export default StepFiveChecklist;
