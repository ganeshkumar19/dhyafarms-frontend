import {
    Box,
    Button,
    Flex,
    Heading,
    Stack,
    Text,
    useColorModeValue,
    useToast,
  } from '@chakra-ui/react';
  import { useNavigate } from 'react-router-dom';
  import Header from '@/components/website/Header';
  import Footer from '@/components/website/Footer';
  import StepFiveChecklist from '@/components/onboarding/StepFiveChecklist';
  import StepFiveInsights from '@/components/onboarding/StepFiveInsights';
import { useTranslation } from 'react-i18next';
import { useOnboardingStore } from '@/store/onBoardingStore';
import { useStepTwoFormStore } from '@/store/stepTwoFormStore';
import { usePondFormStore } from '@/store/pondFarmStore';
import { useManualEntryStore } from '@/store/manualEntryStore';
  
  const GetStartedStep5 = () => {
    const { t } = useTranslation('step5');
    const toast = useToast();
    const navigate = useNavigate();

    const resetOnboardingForm = useOnboardingStore((state) => state.resetForm);
    const resetStepTwoForm = useStepTwoFormStore((state) => state.resetForm);
    const resetPondForm = usePondFormStore((state) => state.resetForm);
    const resetManualEntries = useManualEntryStore((state) => state.resetEntries);

  
    const handleEnterDashboard = () => {
      resetOnboardingForm();
      resetStepTwoForm();
      resetPondForm();
      resetManualEntries();

      toast({
        title: t('getStarted.toastTitle'),
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
  
      navigate('/dashboard');
    };
  
    return (
      <Box minH="100vh" bg="backgroundColor" display="flex" flexDirection="column">
        {/* 🌐 Header */}
        <Header />
  
        {/* 🔽 Content */}
        <Box px={{ base: 4, md: 10 }} py={10} flex="1">
          <Stack spacing={8}>
            {/* ✅ Title */}
            <Box>
              <Heading size="md" mb={1} color="headingColor">
                {t('getStarted.title')}
              </Heading>
              <Text fontSize="sm" color="textColor">
                {t('getStarted.description')}
              </Text>
            </Box>
  
            {/* ✅ Two Column Layout */}
            <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
              <Box
                flex="1"
                bg="cardBg"
                p={6}
                rounded="md"
                shadow="md"
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                minW="300px"
              >
                <StepFiveChecklist />
              </Box>
  
              <Box
                flex="1"
                bg="cardBg"
                p={6}
                rounded="md"
                shadow="md"
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                minW="300px"
              >
                <StepFiveInsights />
              </Box>
            </Flex>
  
            {/* ✅ Dashboard CTA */}
            <Flex justify="center" mt={6}>
              <Button
                size="md"
                px={8}
                colorScheme="green"
                onClick={handleEnterDashboard}
              >
                {t('getStarted.cta')}
              </Button>
            </Flex>
          </Stack>
        </Box>
  
        {/* 🌐 Footer */}
        <Footer />
      </Box>
    );
  };
  
  export default GetStartedStep5;