import { updateUserSettings } from '@/api/preferences';
import EditPondModal from '@/components/modals/EditPondModal';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useDisclosure } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import {
  Box,
  Text,
  Avatar,
  Heading,
  Stack,
  Divider,
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';

{/*interface DeviceStats {
  sensors: number;
  cameras: number;
  feeders: number;
}

{/*interface UserProfile {
  name: string;
  email: string;
  role: string;
  phone: string;
  farmName: string;
  farmLocation: string;
  joined: string;
  ponds: number;
  devices: DeviceStats;
}*/}

{/*const mockProfile: UserProfile = {
  name: 'Rajiv Menon',
  email: 'rajiv@aquaexample.com',
  role: 'Farm Manager',
  phone: '+91 9876543210',
  farmName: 'BlueOcean Aqua Farm',
  farmLocation: 'Andhra Pradesh, India',
  joined: '2023-01-15',
  ponds: 6,
  devices: {
    sensors: 4,
    cameras: 2,
    feeders: 3,
  },
};*/}

const Profile = () => {
  const { user, setUser } = useAuthStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [nameToEdit, setNameToEdit] = useState(user?.name || '');

  

  const handleNameSubmit = async (newName: string) => {
    try {
      await updateUserSettings({ name: newName });
      setNameToEdit(newName);

      if (setUser && user) {
        setUser({ ...user, name: newName });
      }
      console.log('✅ Name updated via API');
    } catch (err) {
      console.error('❌ Failed to update name:', err);
    }
  };
  
  

  if (!user) return null;

  const labelColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box maxW="lg" mx="auto" p={6}>
      <Box bg="cardBg" p={6} borderRadius="lg" shadow="md">
        <Stack spacing={4} align="center">
          <Avatar size="xl" name={user.name} />
          <Heading fontSize="xl" color="textColor">
            {user.name}
          </Heading>
          <Text fontSize="sm" color="textColor">
            {user.email}
          </Text>
          <Text fontSize="sm" color="textColor">
            {user.phone}
          </Text>

          <Divider />

          <Box w="100%" textAlign="left">
            <Stack direction={{base: 'column', md: 'row'}} justifyContent={{base: 'center', md: 'space-between'}} alignItems={{base: 'center'}}>
            <Text fontSize="sm" color={labelColor}>
              Tenant ID
            </Text>
            <Text mb={2} color="textColor">
              {user.tenantId}
            </Text>
            </Stack>
            <Stack direction={{base: 'column', md: 'row'}} justifyContent="space-between" alignItems={{base: 'center'}}>
            <Text fontSize="sm" color={labelColor}>
              Location
            </Text>
            <Text mb={2} color="textColor" textAlign='center'>
              {user.location}
            </Text>
            </Stack>
          </Box>

          <Divider />

          <Button colorScheme="green" variant="outline" size="sm" onClick={onOpen}>
            Edit Profile
          </Button>
        </Stack>
      </Box>
      <EditPondModal
          isOpen={isOpen}
          onClose={onClose}
          currentName={nameToEdit}
          onSubmit={handleNameSubmit}
        />
    </Box>
  );
};

export default Profile;
