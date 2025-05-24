import { VStack } from '@chakra-ui/react';
import {
  Box,
  Flex,
  Link,
  Text,
  HStack,
  Stack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import FISHOBJ from '@/assets/images/fishobj.png';
import { Image } from '@chakra-ui/react';
import { Link as ChakraLink } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const languageNames: Record<string, string> = {
  en: 'English',
  hi: 'हिन्दी',
  ta: 'தமிழ்',
};

const Footer = () => {
  const { t, i18n } = useTranslation('websitefooter');
  const currentLang = languageNames[i18n.language] || 'English';

  return (
    <Box
      bg="#00B8F1"
      py={8}
      px={{ base: 4, md: 12 }}
      color="white"
      position="relative"
      overflow="hidden"
      zIndex={5}
    >
      {/* Fish/Pattern background (optional - you can replace this with SVG later) */}
      <Image
        src={FISHOBJ}
        alt="Fish"
        position="absolute"
        right={{ base: 2, md: 380, xl:300}}
        top="50%"
        transform="translateY(-50%)"
        boxSize={{ base: '150px', md: '340px' }} // Adjust size as needed
        objectFit="contain"
        zIndex={0}
        opacity={1}
      />

      {/* Content Layer */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align={{ base: 'center', md: 'center' }}
        position="relative"
        zIndex={1}
        gap={4}
      >
        {/* Left side links */}
        <VStack
          spacing={6}
          flexWrap="wrap"
          fontWeight="semibold"
          fontSize="sm"
          align={{ base: 'center', md: 'flex-start' }} 
        >
          <Link href="#" _hover={{ textDecoration: 'underline' }}>
            {t('DhyaAquaIntelli')}
          </Link>
          <HStack spacing={2}  flexWrap="wrap" justifyContent={{ base: 'center', md: 'flex-start' }}> 
          <ChakraLink as={RouterLink} to="/faq" _hover={{ textDecoration: 'underline' }}>
            {t('faq')}
          </ChakraLink>
          <ChakraLink as={RouterLink} to="/websupport" _hover={{ textDecoration: 'underline' }}>
            {t('support')}
            </ChakraLink>
            <ChakraLink as={RouterLink} to="/contact" _hover={{ textDecoration: 'underline' }}>
            {t('contact')}
            </ChakraLink>
          </HStack>
        </VStack>

        {/* Right side copy */}
        <Stack spacing={0} align={{ base: 'center', md: 'flex-end' }} textAlign={{ base: 'center', md: 'right' }}>
          <Text fontSize="sm" fontWeight="medium">
            {t('copyright')}
          </Text>
          <Text fontSize="xs">
            Language: {currentLang} &nbsp; · &nbsp; v2.01
          </Text>
        </Stack>
      </Flex>
    </Box>
  );
};

export default Footer;