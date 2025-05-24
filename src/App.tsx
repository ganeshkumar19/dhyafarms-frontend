import { Suspense, useEffect, useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import { Spinner, Center } from '@chakra-ui/react';
import './styles/index.css'
import { Box } from '@chakra-ui/react';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // 3s delay
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box width="100%" height="100vh" display="flex" alignItems="center" justifyContent="center" p={5}>
        <Spinner size="xl" color="green.500" />
      </Box>
    );
  }
  return (
    <Suspense
      fallback={
        <Center h="100vh">
          <Spinner size="xl" color="green.500" />
        </Center>
      }
    >
      <AppRoutes />
    </Suspense>
  );
};

export default App;