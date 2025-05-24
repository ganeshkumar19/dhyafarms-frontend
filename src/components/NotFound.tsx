import { Button } from '@chakra-ui/react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {

  const navigate = useNavigate()
  return (
    <Box height='100vh' display='flex' flexDirection='column' justifyContent='center' bg="backgroundColor">
    <Box textAlign="center" maxW='md' mx='auto' p={6} bg="cardBg" rounded="md" shadow="md" border="1px solid" borderColor='gray.200'>
      <Heading size="lg" pb={4}>404 - Page Not Found</Heading>
      <Text mt={6}>The page you're looking for might have been moved, deleted, or it never existed.</Text>
      <Box display='flex' justifyContent='center' alignItems='center' mt={6}>
        <Button onClick={()=> navigate('/')}>
          Go to Home
        </Button>
      </Box>
    </Box>
    </Box>
  );
};

export default NotFound;