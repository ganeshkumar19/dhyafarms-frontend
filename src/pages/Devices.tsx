import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Card,
  CardBody,
  Stack,
  HStack,
  Tag,
  Spinner,
  Center,
  Icon,
} from '@chakra-ui/react';
import { FiCpu } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/hooks/useAuthStore';
import { getDevices, DeviceAPIResponse } from '../api/device';

const Devices = () => {
  const { user } = useAuthStore();

  const {
    data: devices,
    isLoading,
    isError,
    error,
  } = useQuery<DeviceAPIResponse[]>({
    queryKey: ['devices', user?.id], // Use user.id in the queryKey
    queryFn: () => getDevices(user?.id || ''), // Call getDevices with user.id
    enabled: !!user?.id, // Only run the query if user.id exists
    refetchOnWindowFocus: false, // Optional: Disable refetch on window focus
  });

  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="lg" color="green.500" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Text color="red.500" textAlign="center">
        {error instanceof Error ? error.message : 'Failed to fetch devices'}
      </Text>
    );
  }

  if (devices && devices.length === 0) {
    return (
      <Center py={10}>
        <Text color="gray.500" textAlign="center">
          No devices have been linked with the user.
        </Text>
      </Center>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={6} color="headingColor">
        Registered Devices
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {devices?.map((device) => (
          <Card
            key={device.deviceId}
            bg="deviceCardBg"
            border="1px solid"
            borderColor="borderColor"
            borderRadius="lg"
            shadow="sm"
          >
            <CardBody>
              <Stack spacing={3}>
                {/* Header */}
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiCpu} />
                    <Text fontWeight="medium" color="textPrimary">
                      {device.deviceId}
                    </Text>
                  </HStack>
                  <Tag
                    size="sm"
                    colorScheme={
                      device.status === 'online'
                        ? 'green'
                        : device.status === 'offline'
                        ? 'red'
                        : 'gray'
                    }
                  >
                    {device.status}
                  </Tag>
                </HStack>

                {/* Type */}
                <HStack justify="space-between">
                  <Text fontSize="sm" color="mutedText">
                    Type:
                  </Text>
                  <Text fontSize="sm" color="textPrimary">
                    {device.type}
                  </Text>
                </HStack>

                {/* Pond */}
                <HStack justify="space-between">
                  <Text fontSize="sm" color="mutedText">
                    Linked Pond:
                  </Text>
                  <Text fontSize="sm" fontWeight="medium" color="textPrimary">
                    {device.pondName || 'N/A'}
                  </Text>
                </HStack>

                {/* Last Seen */}
                <HStack justify="space-between">
                  <Text fontSize="sm" color="mutedText">
                    Last Seen:
                  </Text>
                  <Text fontSize="sm" color="textPrimary">
                    {device.lastSeen
                      ? new Date(device.lastSeen).toLocaleString()
                      : 'N/A'}
                  </Text>
                </HStack>

                {/* Last Data */}
                {device.lastData && (
                  <Box bg="cardBg" p={3} borderRadius="md">
                    <Text fontSize="xs" fontWeight="bold" mb={1}>
                      Last Data Snapshot:
                    </Text>
                    <Text
                      fontSize="xs"
                      color="textPrimary"
                      fontFamily="mono"
                      noOfLines={4}
                    >
                      {JSON.stringify(device.lastData, null, 2)}
                    </Text>
                  </Box>
                )}
              </Stack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Devices;
