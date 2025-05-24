import {
    Box,
    Flex,
    Heading,
    useColorModeValue,
    Text,
  } from '@chakra-ui/react';
  import Header from '@/components/website/Header';
  import Footer from '@/components/website/Footer';
  import StepFourForm from '@/components/onboarding/StepFourForm';
  import StepFourInsights from '@/components/onboarding/StepFourInsights';
  import { useTranslation } from 'react-i18next';
  
  export default function GetStartedStep4() {
    
    const { t } = useTranslation("step4");
  
    return (
      <Box minH="100vh" bg={"backgroundColor"} display="flex" flexDirection="column">
        {/* Website Header */}
        <Header />
  
        {/* Page Content */}
        <Box px={{ base: 4, md: 10 }} py={10} flex="1">
          {/* Page Heading */}
          <Heading size="md" mb={1}>
          {t("title")}
          </Heading>
          <Text color="mutedText" mb={6}>
          {t("subtitle")}
          </Text>
  
          {/* Two-column layout */}
          <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
            {/* Form Section */}
            <Box
              w={{ base: '100%', md: '60%' }}
              bg="cardBg"
              p={6}
              rounded="md"
              shadow="cardShadow"
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'gray.600')}
            >
              <StepFourForm />
            </Box>
  
            {/* Insights Section */}
            <Box
              w={{ base: '100%', md: '40%' }}
              bg="cardBg"
              p={6}
              rounded="md"
              shadow="cardShadow"
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'gray.600')}
            >
              <StepFourInsights />
            </Box>
          </Flex>
        </Box>
        <Footer />
      </Box>
    );
  }