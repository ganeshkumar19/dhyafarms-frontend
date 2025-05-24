import React from 'react';
import { Box } from '@chakra-ui/react';
import { ColorModeToggle } from '@/components/ui/ColorModeToggle';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {


  return (
    <Box minH="100vh" bgGradient="bgGradient" display="flex" alignItems="center" justifyContent="center" px={4}>
      {/* Color Mode Toggle Button */}
      <Box position="absolute" top={{ base: 6, md: 4, lg: 2 }} right={4} zIndex="1">
        <ColorModeToggle />
      </Box>

      {/* Page-specific content like login form, text, etc. */}
      {children}
    </Box>
  );
};

export default AuthLayout;
