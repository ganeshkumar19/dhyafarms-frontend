import {
    Box,
    Flex,
    Heading,
    Text,
  } from '@chakra-ui/react';
  import Header from '@/components/website/Header';
  import Footer from '@/components/website/Footer';
  import StepThreeForm from '@/components/onboarding/StepThreeForm';
  import StepThreeInsights from '@/components/onboarding/StepThreeInsights';
import { useTranslation } from 'react-i18next';
  
  export default function GetStartedStep3() {
    
    const {t} = useTranslation('step3')
  
    return (
      <Box minH="100vh" bg="backgroundColor" display="flex" flexDirection="column">
        {/* Website Header */}
        <Header />
  
        {/* Page Content */}
        <Box px={{ base: 4, md: 10 }} py={10} flex="1">
          {/* Heading */}
          <Heading size="md" mb={1} color="headingColor">
            {t('title')}
          </Heading>
          <Text color="textColor" mb={6}>
            {t('subtitle')}
          </Text>
  
          {/* Two-column layout */}
          <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
            {/* Left - Pond Form */}
            <Box
              w={{ base: '100%', md: '50%' }}
              bg="cardBg"
              p={6}
              rounded="md"
              shadow="md"
              border="1px solid"
              borderColor="stepBorderColor"
            >
              <StepThreeForm />
            </Box>
            <Box
              w={{ base: '100%', md: '50%' }}
              bg="cardBg"
              p={6}
              rounded="md"
              shadow="md"
              border="1px solid"
              borderColor="stepBorderColor"
            >
              <StepThreeInsights />
            </Box>
          </Flex>
        </Box>
        <Footer />
      </Box>
    );
  }