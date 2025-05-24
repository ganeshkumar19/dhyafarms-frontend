import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  colorScheme?: string;
  description?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  colorScheme = 'green',
  description,
}) => {
  return (
    <Box
      bg="white"
      boxShadow="md"
      borderRadius="md"
      p={5}
      borderLeftWidth={4}
      borderColor={`${colorScheme}.500`}
      _hover={{ boxShadow: 'lg' }}
      transition="box-shadow 0.2s"
    >
      <Flex align="center" gap={3}>
        {icon && (
          <Box
            fontSize="2xl"
            color={`${colorScheme}.500`}
            bg={`${colorScheme}.50`}
            p={2}
            borderRadius="full"
          >
            {icon}
          </Box>
        )}
        <Box>
          <Text fontSize="sm" color="gray.500" fontWeight="medium">
            {title}
          </Text>
          <Heading size="lg" fontWeight="bold" color="gray.800">
            {value}
          </Heading>
          {description && (
            <Text mt={1} fontSize="xs" color="gray.400">
              {description}
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default DashboardCard;