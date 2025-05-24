import {
    Box,
    Text,
    VStack,
  } from '@chakra-ui/react';
  import { useTranslation } from 'react-i18next';
  import aquaBg from '@/assets/images/aquaintellilanding.jpg';
  import { useColorModeValue } from '@chakra-ui/react';
  import gifImage from '@/assets/images/aquaculture.gif';
  
  const AboutUs = () => {

    const {t} = useTranslation('about')
    const overlayColor = useColorModeValue('rgba(0,0,0,0.6)', 'rgba(0,0,0,0.6)');
   
    return (
       <>

        <Box
        position="relative"
        flex="1"
        bgImage={`url(${aquaBg})`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        display="flex"
        flex-direction="column"
        alignItems="flex-start"
        justifyContent="center"
        px={{ base: 4, md: 20 }}
        pt={{ base: 8, md: 12 }}
        pb={{ base: 16, md: 18 }} // more padding-bottom to show more of the image
      >
  <Box position="absolute" inset={0} bg={overlayColor} zIndex={0} />

  <VStack spacing={3} zIndex={1} maxW="5xl" mx="auto" color="white" textAlign="center">
    <Text fontSize="3xl" fontWeight="900" mb={5}>
      {t('title')}
    </Text>
    <Text fontSize={{ base: 'xs', sm: 'sm' }} fontWeight="400" lineHeight="30px">
      {t('description')}
    </Text>
    <Text fontSize={{ base: 'xs', sm: 'sm' }} fontWeight="400" lineHeight="30px">
      {t('mission')}
    </Text>

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

       </>
      
    );
  };
  
  export default AboutUs;