import { useAuthStore } from '../hooks/useAuthStore';
import { Box, Button, Text, Stack, Heading } from '@chakra-ui/react'; // Chakra UI components

const Header = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
 


  return (
    <Box bg="cardBg" shadow="md" px={6} py={4}>
      <Stack direction="row" justify="space-between" align="center">
        <Heading as="h1" size="lg" fontSize={{ xs: '12px', sm: '14px', md: '16px' }} color="headingColor">
          Dhya Farms Dashboard
        </Heading>

        {/* Stack for User Info & Logout (Responsive) */}
        <Stack direction={{ base: "column", sm: "row" }} spacing={2} align="center">
          <Text fontSize="sm" color="headingColor"textAlign={'center'} >
            Hello, {user?.email}
          </Text>
          <Button
            onClick={() => {
              logout();
              window.location.href = '/';
            }}
            colorScheme="red"
            variant="solid"
            size="sm"
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Header;