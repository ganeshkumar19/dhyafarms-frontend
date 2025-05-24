// src/components/LoadingSpinner.tsx
import { Spinner, Box, Center } from '@chakra-ui/react';

const LoadingSpinner = () => {
  return (
    <Center height="100vh">
      <Box textAlign="center">
        <Spinner size="xl" color="green.500" />
      </Box>
    </Center>
  );
};

export default LoadingSpinner;