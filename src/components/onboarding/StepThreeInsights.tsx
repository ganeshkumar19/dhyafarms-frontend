import {
    Box,
    Heading,
    List,
    ListItem,
    Stack,
    Text,
    Divider,
    Badge,
    Icon,
  } from '@chakra-ui/react';
  import { MdSensors, MdEditNote } from 'react-icons/md';
  import StepProgressBar from './StepProgressBar';
import { usePondFormStore } from '@/store/pondFarmStore';
import { useTranslation } from 'react-i18next';
  
  
  const StepThreeInsights = () => {
    const pondList = usePondFormStore((state) => state.pondList);
    const {t} = useTranslation('step3');
    return (
      <Stack spacing={4}>
        <StepProgressBar step={3} total={5} />
  
        <Box>
          <Heading size="xs" mb={1}>
            {t('insights.whyTitle')}
          </Heading>
          <Text fontSize="sm" color="subTextColor">
          {t('insights.whyDesc')}
          </Text>
        </Box>
  
        <Divider />
  
        {pondList.length > 0 ? (
          pondList.map((pond, index) => (
            <Box
              key={index}
              border="1px"
              borderColor={"borderColor"}
              borderRadius="md"
              p={4}
              bg="cardBg"
            >
              <Heading size="xs" mb={2}>
              {t('insights.pond')} {index + 1}: {pond.pondName}
              </Heading>
              <List spacing={2} fontSize="sm">
                <ListItem>
                  📏 <strong>{t('insights.size')}:</strong> {pond.pondSize}
                </ListItem>
                {pond.stockingDensity && (
                  <ListItem>
                    🧪 <strong>{t('insights.stockingDensity')}:</strong> {pond.stockingDensity}
                  </ListItem>
                )}
                <ListItem>
                  🧬 <strong>{t('insights.species')}:</strong> {pond.species}
                </ListItem>
  
                {pond.monitoring === 'sensor' && pond.deviceIds.length > 0 && (
                  <ListItem display="flex" alignItems="center">
                    <Icon as={MdSensors} boxSize={4} mr={1} />
                    <strong>{t('insights.monitoringDevices')}</strong>
                    {pond.deviceIds.map((id, i) => (
                      <Badge
                        key={i}
                        ml={2}
                        colorScheme="blue"
                        borderRadius="md"
                        px={2}
                        py={0.5}
                      >
                        {id}
                      </Badge>
                    ))}
                  </ListItem>
                )}
  
                {pond.monitoring === 'manual' && (
                  <ListItem display="flex" alignItems="center">
                    <Icon as={MdEditNote} boxSize={4} mr={1} />
                    {t('insights.manualEntry')}
                  </ListItem>
                )}
              </List>
            </Box>
          ))
        ) : (
          <Box fontSize="sm" color={"mutedText"}>
            {t('insights.noPondsAdded')}
          </Box>
        )}
      </Stack>
    );
  };
  
  export default StepThreeInsights;