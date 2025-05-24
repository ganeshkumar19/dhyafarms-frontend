import {
    Box,
    Flex,
    Heading,
    Text,
    useColorModeValue,
  } from '@chakra-ui/react';
  import Header from '@/components/website/Header';
  import Footer from '@/components/website/Footer';
  import StepTwoForm from '@/components/onboarding/StepTwoForm';
  import StepTwoInsights from '@/components/onboarding/StepTwoInsights';
import { useTranslation } from 'react-i18next';
  
  export default function GetStartedStep2() {
    const {t} = useTranslation('step2')
    return (
      <Box minH="100vh" bg="backgroundColor" display="flex" flexDirection="column">
        <Header />
        <Box px={{ base: 4, md: 10 }} py={10} flex="1">
          <Heading size="md" mb={1} color={useColorModeValue('black', 'white')}>
            {t('setupFarmTitle')}
          </Heading>
          <Text color="textColor" mb={6}>
           {t('setupFarmSubtitle')}
          </Text>
  
          {/* 📐 Two-column layout */}
          <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
            {/* 📝 Form Section */}
            <Box
              w={{ base: '100%', md: '50%' }}
              bg="cardBg"
              p={6}
              rounded="md"
              shadow="md"
              border="1px solid"
              borderColor="stepBorderColor"
            >
              <StepTwoForm />
            </Box>
  
            {/* 💡 Insights Section */}
            <Box
              w={{ base: '100%', md: '50%' }}
              bg="cardBg"
              p={6}
              rounded="md"
              shadow="md"
              border="1px solid"
              borderColor="stepBorderColor"
            >
              <StepTwoInsights />
            </Box>
          </Flex>
        </Box>
  
        {/* 🌐 Website Footer */}
        <Footer />
      </Box>
    );
  }