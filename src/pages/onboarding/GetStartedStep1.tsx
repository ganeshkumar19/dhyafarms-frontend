import {
    Box,
    Flex,
    Heading,
    Stack,
    useColorModeValue,
    Text,
  } from '@chakra-ui/react';
  import StepOneForm from '@/components/onboarding/StepOneForm';
  import StepOneInsights from '@/components/onboarding/StepOneInsights';
  import Header from '@/components/website/Header';
  import Footer from '@/components/website/Footer';
  import { useTranslation } from 'react-i18next';
  import { useLocation } from 'react-router-dom';
  
  export default function GetStartedStep1() {
    const {t} = useTranslation('step1')
    const location = useLocation();

    const passedMobile = location.state?.mobile || '';
   const passedCountryCode = location.state?.countryCode || '+91';


    // 🌗 Dynamic colors
    return (
      <Box minH="100vh" bg="backgroundColor" display="flex" flexDirection="column">
        {/* 🌐 Header */}
        <Header />
  
        {/* 🔽 Page Content */}
        <Box px={{ base: 4, md: 10 }} py={10} flex="1">
          <Stack spacing={4}>
            {/* 🏷️ Page Heading */}
            <Box>
              <Heading size="md" mb={1} color="headingColor">
               {t('welcomeTitle')}
              </Heading>
              <Text color="textColor">
              {t('welcomeSubtitle')}{' '}
                <Text as="span" fontSize="sm" color="subTextColor">
                  {t('welcomeSubtitle2')}
                </Text>
              </Text>
            </Box>
  
            {/* 📐 Two-column layout */}
            <Flex direction={{ base: 'column', md: 'row' }} gap={8} mt={6}>
              {/* 📝 Form Section */}
              <Box
                w={{ base: '100%', md: '50%' }}
                bg="cardBg"
                p={6}
                rounded="md"
                shadow="md"
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
              >
                <StepOneForm passedMobile={passedMobile} passedCountryCode={passedCountryCode}/>
              </Box>
  
              {/* 💡 Insights Section */}
              <Box
                w={{ base: '100%', md: '50%' }}
                bg="cardBg"
                p={6}
                rounded="md"
                shadow="md"
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
              >
                <StepOneInsights />
              </Box>
            </Flex>
          </Stack>
        </Box>
  
        {/* 🌐 Footer */}
        <Footer />
      </Box>
    );
  }