import {
    Box,
    Heading,
    Text,
    SimpleGrid,
    Stack,
    Badge,
    Button,
    useColorModeValue,
    Icon,
  } from '@chakra-ui/react';
  import { FaCheckCircle } from 'react-icons/fa';
  import { useMemo } from 'react';
  import { useTranslation } from 'react-i18next';
import RazorpayButton from '@/components/RaazorPayButton';

declare global {
  interface Window {
    Calendly?: {
      initBadgeWidget: (options: {
        url: string;
        text: string;
        color: string;
        textColor: string;
      }) => void;
    };
  }
}
  
  const SettingsPlans = () => {
    const { t } = useTranslation('plans');
  
    const plans = useMemo(() => [
      {
        id: 'basic',
        name: t('basic'),
        price: t('free'),
        description: t('basicDescription'),
        features: [
          t('basicFeatures.farmLimit'),
          t('basicFeatures.deviceLimit'),
          t('basicFeatures.dashboard'),
          t('basicFeatures.support'),
        ],
        isCurrent: true,
      },
      {
        id: 'pro',
        name: t('pro'),
        price: t('proPrice'),
        description: t('proDescription'),
        features: [
          t('proFeatures.farmLimit'),
          t('proFeatures.deviceLimit'),
          t('proFeatures.dashboard'),
          t('proFeatures.support'),
        ],
        isCurrent: false,
      },
      {
        id: 'enterprise',
        name: t('enterprise'),
        price: t('enterprisePrice'),
        description: t('enterpriseDescription'),
        features: [
          t('enterpriseFeatures.features'),
          t('enterpriseFeatures.manager'),
          t('enterpriseFeatures.support'),
        ],
        isCurrent: false,
      },
    ], [t]);
  
    return (
      <Box>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {plans.map((plan) => (
            <Box
              key={plan.id}
              p={6}
              bg="cardBg"
              border="1px solid"
              borderColor="manualBorderColor"
              borderRadius="lg"
              boxShadow="sm"
              transition="all 0.2s"
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: 'lg',
              }}
            >
              <Stack spacing={4}>
                <Heading size="md" color="subTextColor">
                  {plan.name}
                </Heading>
  
                <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>
                  {plan.price}
                </Text>
  
                <Text fontSize="sm" color="mutedText">
                  {plan.description}
                </Text>
  
                <Stack spacing={2} mt={2}>
                  {plan.features.map((feature, idx) => (
                    <Text key={idx} fontSize="sm" color="mutedText">
                      <Icon as={FaCheckCircle} mr={2} color="green.400" />
                      {feature}
                    </Text>
                  ))}
                </Stack>
  
                {plan.isCurrent ? (
                            <Badge colorScheme="green" variant="solid" alignSelf="start" mt={2}>
                              {t('currentPlan')}
                            </Badge>
                          ) : plan.id === 'pro' ? (
                            <Box mt={2}>
                              <RazorpayButton />
                            </Box>
                          ) : (
                            <Button
                                    onClick={() => {
                                      if (window.Calendly) {
                                        // Open Calendly in a new window/tab
                                        const calendlyUrl = 'https://calendly.com/dharsan-dhya/aquaintelli';
                                        window.open(calendlyUrl, '_blank', 'noopener,noreferrer');
                                      } else {
                                        console.warn('Calendly script not loaded');
                                      }
                                    }}
                                    colorScheme="green"
                                    size="sm"
                                    variant="outline"
                                    alignSelf="start"
                                    mt={2}
                                  >
                                    {t('upgrade')}
                                  </Button>

                          
                          )}

              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    );
  };
  
  export default SettingsPlans;
  