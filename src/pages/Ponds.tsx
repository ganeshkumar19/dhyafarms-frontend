import { useState } from 'react'
import { useParams } from 'react-router-dom';
import { Box, Heading, Spinner, Text, VStack, Center } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getPondsByFarmId } from '@/api/pond';
import { SimpleGrid } from '@chakra-ui/react';
import { HStack } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import AddPondModal from '@/components/modals/AddPondModal';
import { formatLabel, isValidDate, getVisibleData } from '@/helpers/pondHelpers';



const MAX_VISIBLE_FIELDS = 4;

const Ponds = () => {
    const { farmId } = useParams<{ farmId: string }>();
    const [expandedPondIds, setExpandedPondIds] = useState<Record<string, boolean>>({});
    const { isOpen, onOpen, onClose } = useDisclosure();

    

    const {
        data: ponds,
        isLoading,
        isError,
        error,
      } = useQuery({
        queryKey: ['ponds', farmId],
        queryFn: () => getPondsByFarmId(farmId || ''),
        enabled: !!farmId, // only run if farmId exists
        refetchOnWindowFocus: false,
      });

      const toggleExpand = (pondId: string) => {
        setExpandedPondIds((prev) => ({
          ...prev,
          [pondId]: !prev[pondId],
        }));
      };

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading color="textColor">Ponds</Heading>
        <Button colorScheme="teal" onClick={onOpen}>
          Add Pond
        </Button>
      </Flex>


      {isLoading ? (
        <Center py={10}>
          <Spinner size="lg" color="green.500" />
        </Center>
      ) : isError ? (
        <Text color="red.500" textAlign="center">
          {(error as any)?.message || 'Failed to fetch ponds'}
        </Text>
      ) : ponds?.length === 0 ? (
        <Text textAlign="center" color="textLabel">
          No ponds linked with this farm.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} alignItems="start">
          {ponds?.map((pond) => {
            const visibleData = getVisibleData(pond);

            const isExpanded = expandedPondIds[pond.id] || false;
            const fieldsToShow = isExpanded ? visibleData : visibleData.slice(0, MAX_VISIBLE_FIELDS);

            return (
              <Box
                key={pond.id}
                p={5}
                borderWidth="1px"
                borderRadius="2xl"
                bg="cardBg"
                borderColor="gray.200"
                boxShadow="sm"
                transition="all 0.2s"
                _hover={{ boxShadow: 'md' }}
              >
                <Heading size="md" mb={3} color="textMain">
                  {pond.name}
                </Heading>

                <VStack align="start" spacing={2}>
                  {fieldsToShow.map(([key, value]) => (
                    <HStack key={key} justify="space-between" width="100%" px={2}>
                      <Text fontSize="sm" color="textLabel">
                        {formatLabel(key)}
                      </Text>
                      <Text fontWeight="medium" color="textMain">
                        {typeof value === 'string' && isValidDate(value)
                            ? new Date(value).toLocaleString()
                            : value.toString()}
                        </Text>
                    </HStack>
                  ))}
                </VStack>

                {visibleData.length > MAX_VISIBLE_FIELDS && (
                    <Box display='flex' justifyContent='flex-end' width='100%'>
                  <Button
                    onClick={() => toggleExpand(pond.id)}
                    mt={3}
                    size="sm"
                    variant="ghost"
                    colorScheme="blue"
            
                  >
                    {isExpanded ? 'Show Less' : 'Show More'}
                  </Button>
                  </Box>
                )}
              </Box>
            );
          })}
        </SimpleGrid>
      )}
       <AddPondModal isOpen={isOpen} onClose={onClose} farmId={farmId || ''}/>
    </Box>
  )
}

export default Ponds