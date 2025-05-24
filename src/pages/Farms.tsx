import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Heading, Center, Spinner, Text,
  SimpleGrid, Card, CardBody, Stack, HStack, Button
} from '@chakra-ui/react';
import { useFarmStore } from '@/store/farmsGlobal';
import { getFarms } from '@/api/farm';
import { useTranslation } from 'react-i18next';

const Farms = () => {
  const { farms, setFarms } = useFarmStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation('farms');

  const fetchFarms = async () => {
    try {
      const res = await getFarms();
      setFarms(res);
      console.log('Fetched farms:', res);
    } catch (err: any) {
      setError(err.response?.data?.error || t('errorFetchingFarms'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();

  }, []);

  const getCity = (fullLocation: string): string => {
    return fullLocation?.split(',')[0]?.trim() || t('notAvailable');
  };

  return (
    <Box>
      <Heading mb={6} textAlign="left" color="textColor">
        {t('myFarms')}
      </Heading>
      {loading ? (
        <Center py={10}>
          <Spinner size="lg" color="green.500" />
        </Center>
      ) : error ? (
        <Text color="red.500" textAlign="center">
          {error}
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {farms.map((farm) => {
            const farmDetails = [
              { label: t('location'), value: getCity(farm.location) },
              { label: t('size'), value: farm.farmSize || t('notAvailable') },
              { label: t('type'), value: farm.farmType || t('notAvailable') },
              { label: t('waterSource'), value: farm.waterSrc || t('notAvailable') },
              {
                label: t('createdAt'),
                value: new Date(farm.createdAt || '').toLocaleDateString()
              }
            ];

            return (
              <Card
                key={farm.id}
                shadow="md"
                borderRadius="lg"
                bg="cardBg"
                border="1px solid"
                borderColor="cardBorder"
              >
                <CardBody>
                  <Stack spacing={3}>
                    <Heading size="md" color="textColor">
                      {farm.name}
                    </Heading>

                    {farmDetails.map(({ label, value }) => (
                      <HStack key={label} justify="space-between">
                        <Text fontSize="sm" color="textLabel">
                          {label}:
                        </Text>
                        <Text fontSize="sm" color="textMain" fontWeight="700">
                          {value}
                        </Text>
                      </HStack>
                    ))}
                  </Stack>
                  <Box display="flex" justifyContent="center" mt={3}>
                    <Button
                      bg="green.500"
                      color="white"
                      _hover={{ bg: 'green.600' }}
                      onClick={() => navigate(`/farms/${farm.id}`)}
                    >
                      {t('viewPonds')}
                    </Button>
                  </Box>
                </CardBody>
              </Card>
            );
          })}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Farms;