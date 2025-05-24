import { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  Spinner,
  SimpleGrid,
  Card,
  CardBody,
  HStack,
  Badge,
  VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import CreateSupportModal from '@/components/modals/CreateSupportModal';
import { getSupportTickets } from '@/api/support';
import { formatDate, getSeverityColor, truncateText } from '@/helpers/supportHelpers';

interface TICKET {
  ticketno: string,
  deviceId: string,
  userId: string,
  issue: string,
  screenshotUrl: string,
  severity: string,
  createdAt: string
}

const Support = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation('support');

  const {
    data: tickets,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['supportTickets'],
    queryFn: getSupportTickets,
  });

  return (
    <Box p={6}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="md" color="textColor">
          {t('title')}
        </Heading>
        <Button colorScheme="green" onClick={() => setIsModalOpen(true)}>
          Create Support
        </Button>
      </Box>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Text color="red.500">Failed to load support tickets</Text>
      ) : tickets?.length === 0 ? (
        <Text textAlign="center" color="textLabel">
          No Support Tickets has been Created
        </Text>
      ): (
        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          {tickets.map((ticket: TICKET) => (
            <Card
              key={ticket.ticketno}
              borderWidth="1px"
              borderRadius="2xl"
              bg="cardBg"
              borderColor="gray.200"
              boxShadow="sm"
              transition="all 0.2s"
              _hover={{ boxShadow: 'md' }}
            >
              <CardBody>
                <VStack align="start" spacing={2}>
                  <HStack justify="space-between" w="100%">
                    <Text fontWeight="bold">Ticket No:</Text>
                    <Text>{ticket.ticketno}</Text>
                  </HStack>
                  <HStack justify="space-between" w="100%">
                    <Text fontWeight="bold">Issue:</Text>
                    <Text title={ticket.issue}>{truncateText(ticket.issue, 20)}</Text>
                  </HStack>
                  <HStack justify="space-between" w="100%">
                    <Text fontWeight="bold">Severity:</Text>
                    <Badge colorScheme={getSeverityColor(ticket.severity)}>
                      {ticket.severity}
                    </Badge>
                  </HStack>
                  <HStack justify="space-between" w="100%">
                      <Text fontWeight="bold">Date:</Text>
                      <Text>{formatDate(ticket.createdAt)}</Text>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <CreateSupportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
};

export default Support;

