import {
    Box,
    Button,
    Heading,
    Stack,
    Text,
    List,
    ListItem,
    useColorModeValue,
  } from '@chakra-ui/react';
  import StepProgressBar from './StepProgressBar';
  import { useTranslation } from 'react-i18next';


  
const StepFiveInsights = () => {
      const { t } = useTranslation('step5');
    
      return (
        <Stack spacing={6}>
          {/* ✅ Step Progress */}
          <StepProgressBar step={5} total={5} />
    
          {/* ✅ Free Plan Summary */}
          <Box
            border="1px solid"
            borderColor="freeBorder"
            bg="freeCardBg"
            p={4}
            rounded="md"
          >
            <Heading size="xs" mb={2} color="greenText">
              {t('insights.free.title')}
            </Heading>
            <List fontSize="sm" spacing={1} color="premiumText">
              <ListItem>✔️ {t('insights.free.entry')}</ListItem>
              <ListItem>✔️ {t('insights.free.limit')}</ListItem>
              <ListItem>✔️ {t('insights.free.email')}</ListItem>
            </List>
          </Box>
    
          {/* ✅ Premium Plan Offer */}
          <Box
            border="1px solid"
            borderColor="borderColor"
            bg="cardBg"
            p={4}
            rounded="md"
          >
            <Heading size="xs" mb={2} color={useColorModeValue('black', 'white')}>
              {t('insights.premium.title')}
            </Heading>
            <List fontSize="sm" spacing={1} color="premiumText">
              <ListItem>✔️ {t('insights.features.sync')}</ListItem>
              <ListItem>✔️ {t('insights.features.alerts')}</ListItem>
              <ListItem>✔️ {t('insights.features.weather')}</ListItem>
              <ListItem>✔️ {t('insights.features.reports')}</ListItem>
              <ListItem>✔️ {t('insights.features.tips')}</ListItem>
            </List>
            <Text mt={3} fontSize="xs" color="premiumText">
              {t('insights.premium.note')}
            </Text>
            <Text fontSize="xs" color="premiumText" mt={1}>
              {t('insights.premium.quote')}
            </Text>
    
            <Button mt={4} size="sm" colorScheme="green" variant="outline">
              {t('insights.premium.cta')}
            </Button>
          </Box>
        </Stack>
      );
    };
    
    export default StepFiveInsights;