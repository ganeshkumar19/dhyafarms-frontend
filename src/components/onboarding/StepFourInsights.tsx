import {
    Box,
    Heading,
    List,
    ListItem,
    Stack,
    Text,
  } from '@chakra-ui/react';
  import { useEffect, useState } from 'react';
  import StepProgressBar from './StepProgressBar'; // 👈 Reusable progress bar
import { ManualDataEntry, useManualEntryStore } from '@/store/manualEntryStore';
import { useTranslation } from 'react-i18next';
import { fishFields, waterFields } from './FormFeilds';
  

  
  const StepFourInsights = () => {
    const { t } = useTranslation('step4');
    const entries = useManualEntryStore((state) => state.entries);
    const [lastEntry, setLastEntry] = useState<ManualDataEntry | null>(null);
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    
  
    useEffect(() => {
      if (entries.length > 0) {
        setLastEntry(entries[entries.length - 1]);
      }
    }, [entries]);

    const fieldTranslationOverrides: Record<string, string> = {
      do: 'Do',
      ph: 'Ph',
      tds: 'Tds',
      orp: 'Orp',
      temp: 'Temp',
      ammonia: 'Ammonia',
      nitrite: 'Nitrite',
      nitrate: 'Nitrate',
      salinity: 'Salinity',
      turbidity: 'Turbidity',
      chlorine: 'Chlorine',
      water_level: 'Water_level',
    };
    
    const getTranslationKey = (fieldName: string) => {
      const keySuffix = fieldTranslationOverrides[fieldName.toLowerCase()] || capitalize(fieldName);
      return `form.entry${keySuffix}`;
    };
  
  
    return (
      <Stack spacing={4}>
        <StepProgressBar step={4} total={5} />
        <Box>
        <Heading size="xs" mb={2}>
          {t('insights.heading')}
        </Heading>
        <Text fontSize="sm" color="textColor">
          {t('insights.description')}
        </Text>
        </Box>
  
        {/* Visual Aid Placeholder */}
        <Box
          border="1px dashed"
          borderColor="borderColor"
          borderRadius="md"
          p={4}
          fontSize="sm"
          color="gray.500"
        >
            <Text mb={2}>{t('insights.visual1')}</Text>
            <Text>{t('insights.visual2')}</Text>
        </Box>
  
        {/* Preview of Last Manual Entry */}
        {lastEntry && (
    <Box border="1px solid" borderColor="borderColor" rounded="md" p={4}>
    <Heading size="xs" mb={2}>
     {t('insights.lastEntryHeading')}
    </Heading>
    <List spacing={2} fontSize="sm">
    <ListItem>{t('insights.farm', { value: lastEntry.farmName })}</ListItem>
    <ListItem>{t('insights.pond', { value: lastEntry.pondName })}</ListItem>
    <ListItem>{t('insights.entryType', { value: lastEntry.type })}</ListItem>

    {lastEntry.type === 'Water' &&
          waterFields.map((field) => {
            const value = lastEntry[field.name as keyof ManualDataEntry];
            return (
              value && (
                <ListItem key={field.name}>
                 {t(getTranslationKey(field.name), { value })}
                </ListItem>
              )
            );
          })}


{lastEntry.type === 'Fish' &&
  fishFields.map((field) => {
    const value = lastEntry[field.name as keyof ManualDataEntry];
    return (
      value && (
        <ListItem key={field.name}>
          {t(`form.entry${capitalize(field.name)}`, { value })}
        </ListItem>
      )
    );
  })}
    </List>
  </Box>
)}

      </Stack>
    );
  };
  
  export default StepFourInsights;