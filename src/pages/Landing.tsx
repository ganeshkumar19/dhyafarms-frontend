import {
  Box,
  Button,
  Flex,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import aquaBg from '@/assets/images/aquaintellilanding.jpg';
import gifImage from '@/assets/images/aquaculture.gif';

const Landing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('landing');

  const overlayColor = useColorModeValue('rgba(0,0,0,0.6)', 'rgba(0,0,0,0.6)');
  const textColor = useColorModeValue('whiteAlpha.900', 'whiteAlpha.900');
  const subTextColor = useColorModeValue('gray.300', 'gray.300');

  return (
    <>
      {/* Hero Section */}
      <Box
        position="relative"
        flex="1"
        minH={{base: '80vh', xl: '80vh'}}
        bgImage={`url(${aquaBg})`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="repeat"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={{ base: 4, md: 20 }}
        py={{ base: 20, md: 28 }}
      >
        {/* Overlay */}
        <Box position="absolute" inset={0} bg={overlayColor} zIndex={0} />

        {/* Main Flex */}
        <Flex
          position="relative"
          zIndex={1}
          w="full"
          maxW="7xl"
          mx="auto"
          align="center"
          justify="space-between"
          gap={10}
          flexDirection={{ base: 'column', md: 'row' }}
        >
          {/* Left: GIF (visible on all screens now) */}
          <Box
            flex="1"
            maxW={{ base: '300px', md: '480px' }}
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            bg="transparent"
          >
            <img
              src={gifImage}
              alt="Aqua Device"
              style={{
                width: '100%',
                height: 'auto',
                background: 'transparent',
                objectFit: 'contain',
              }}
            />
          </Box>

          {/* Right: Text and CTA */}
          <Stack
            spacing={6}
            align={{ base: 'center', md: 'flex-end' }}
            textAlign={{ base: 'center', md: 'right' }}
            w="full"
            maxW="2xl"
            ml="auto"
            pr={{ base: 0, md: 12 }}
          >
            <Text
              fontSize={{ base: '3xl', md: '5xl' }}
              fontWeight="bold"
              color={textColor}
              lineHeight="short"
              textShadow="0 1px 2px rgba(0,0,0,0.1)"
            >
              {t('welcomeMessage')}
            </Text>

            <Text
              fontSize={{ base: 'lg', md: '2xl' }}
              fontWeight="medium"
              color={subTextColor}
              textShadow="0 1px 2px rgba(0,0,0,0.08)"
            >
              {t('subtitleMessage')}
            </Text>

            <HStack spacing={4} pt={2} justify={{ base: 'center', md: 'flex-end' }}>
              <Button
                variant="outline"
                size="md"
                borderRadius="md"
                color={textColor}
                borderColor={textColor}
                _hover={{ bg: 'whiteAlpha.700' }}
                onClick={() => navigate('/about')}
              >
                {t('knowMore') || 'Know More'}
              </Button>
              <Button
                colorScheme="blue"
                size="md"
                borderRadius="md"
                _hover={{ bg: 'blue.600' }}
                onClick={() => navigate('/get-started')}
              >
                {t('getStarted') || 'Get Started'}
              </Button>
            </HStack>
          </Stack>
        </Flex>
      </Box>
      </>
  );
};

export default Landing;