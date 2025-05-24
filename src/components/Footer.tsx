// src/components/Footer.tsx
import { Box, Text } from '@chakra-ui/react';

const Footer = () => {

 
  return (
    <Box bg="cardBg" borderTop="1px" borderColor="gray.200" p={4} textAlign="center">
      <Text fontSize="sm" color="headingColor">
        © {new Date().getFullYear()} Dhya Farms — Empowering Aquaculture
      </Text>
    </Box>
  );
};

export default Footer;