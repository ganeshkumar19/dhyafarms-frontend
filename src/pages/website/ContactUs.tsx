import {
  Box,
  Text,
  VStack,
  Link,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdEmail } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import aquaBg from '@/assets/images/aquaintellilanding.jpg';
import gifImage from '@/assets/images/aquaculture.gif';

const ContactUs = () => {
  const { t } = useTranslation('contact');
  const overlayColor = useColorModeValue('rgba(0,0,0,0.6)', 'rgba(0,0,0,0.6)');

  return (
    <Box
      position="relative"
      bgImage={`url(${aquaBg})`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      px={{ base: 4, md: 20 }}
      pt={{ base: 12, md: 24 }}
      pb={{ base: 16, md: 32 }}
    >
      <Box position="absolute" inset={0} bg={overlayColor} zIndex={0} />

      <VStack spacing={6} zIndex={1} position="relative" color="white" textAlign="center" maxW="4xl" mx="auto">
        <Text fontSize="4xl" fontWeight="bold">
          {t('heading')}
        </Text>

        <Text fontSize="md" lineHeight="28px" maxW="3xl">
       {t('para1')}
        </Text>

        <Text fontSize="sm" maxW="3xl">
        {t('para2')}
        </Text>

        <Link
          href="mailto:support@dhya.in"
          display="inline-flex"
          alignItems="center"
          fontSize="lg"
          fontWeight="bold"
          color="blue.200"
          _hover={{ color: 'blue.400', textDecoration: 'underline' }}
        >
          <Icon as={MdEmail} mr={2} />
          {t('email')}
        </Link>
        <Box
      maxW={{ base: '300px', md: '480px' }}
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      bg="transparent"
      ml={{base:0, md:20}}
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
      </VStack>
    </Box>
  );
};

export default ContactUs;
