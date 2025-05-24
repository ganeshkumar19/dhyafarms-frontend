import { getPondLogs, getPondsByFarmId } from '@/api/pond';
import { formatLogDetails, getBadgeColor } from '@/helpers/pondHelpers';
import { useFarmStore } from '@/store/farmsGlobal';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  Flex,
  Select,
  useColorModeValue,
  Stack,
  Spinner,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';



const PondLogsPanel = () => {
  const { t } = useTranslation('pondlogs');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { activeFarmId } = useFarmStore();
  const [selectedPondId, setSelectedPondId] = useState('');
  const [selDate, setSelDate] = useState<'today' | 'last7days'>('today');

  const { data: ponds = [], isLoading: isPondLoading } = useQuery({
    queryKey: ['ponds', activeFarmId],
    queryFn: () => getPondsByFarmId(activeFarmId || ''),
    enabled: !!activeFarmId,
  });

  const { data: pondLogsData = [], isLoading: isLogsLoading } = useQuery({
    queryKey: ['pondLogs', selectedPondId, selDate],
    queryFn: () => getPondLogs(selectedPondId, selDate),
    enabled: !!selectedPondId,
  });


  const pondLogs = pondLogsData?.logs ?? [];

  

  return (
    <Box
      bg="cardBg"
      p={5}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      shadow="sm"
    >
      {/* Header */}
      <Flex
        justify="space-between"
        align={{ base: 'start', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        mb={4}
        gap={3}
      >
        <Heading size="sm">{t('pondLogs')}</Heading>
        <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
          {isPondLoading ? (
            <Spinner size="sm" />
          ) : (
            <Select
              placeholder={t('selectPond')}
              size="sm"
              value={selectedPondId}
              onChange={(e: any) => setSelectedPondId(e.target.value)}
              maxW="200px"
            >
              {ponds.map((pond) => (
                <option key={pond.id} value={pond.id}>
                  Pond: {pond.name}
                </option>
              ))}
            </Select>
          )}
          <Select
            size="sm"
            value={selDate}
            onChange={(e: any) => setSelDate(e.target.value as 'today' | 'last7days')}
            maxW="150px"
          >
            <option value="today">{t('today')}</option>
            <option value="last7days">{t('last7Days')}</option>
          </Select>
        </Stack>
      </Flex>

      {/* Log Table */}
      {isLogsLoading ? (
        <Flex justify="center" my={6}>
          <Spinner size="md" />
        </Flex>
      ) : pondLogs.length > 0 ? (
        <Box overflowX="auto">
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>{t('time')}</Th>
                <Th>{t('type')}</Th>
                <Th>{t('details')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pondLogs.map((log: any, idx: number) => {
                const displayTime = format(new Date(log.createdAt), 'HH:mm');
                const logType = log.type;
                return (
                  <Tr key={idx}>
                    <Td fontSize="sm" whiteSpace="nowrap">{displayTime}</Td>
                    <Td fontSize="sm">
                      <Badge colorScheme={getBadgeColor(logType)}>
                        {logType}
                      </Badge>
                    </Td>
                    <Td fontSize="sm">
                      <Text>
                        <strong>{logType === 'manual' ? 'Manual Entry' : logType}:</strong>{' '}
                        {formatLogDetails(log)}
                      </Text>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Text fontSize="sm" color="gray.500" mt={4} textAlign="center">
          {t('noNewLogs') || 'No new logs available'}
        </Text>
      )}
    </Box>
  );
};

export default PondLogsPanel;

