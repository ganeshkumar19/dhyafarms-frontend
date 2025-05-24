import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/website/Header'; // adjust path as needed
import Footer from '@/components/website/Footer'; // adjust path as needed

const WebsiteLayout = () => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      <Box as="main" flex="1">
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
};

export default WebsiteLayout;