import {
    Box,
    Heading,
    Text,
    Stack,
    Badge,
    Icon,
    HStack,
    Spinner,
    Center,
  } from '@chakra-ui/react';
  import { FiAlertCircle } from 'react-icons/fi';
  import { getFarmNotifications, getUserNotifications } from '@/api/alerts';
  import { NotificationItem } from '@/types/models';
  import { useTranslation } from 'react-i18next';
  import { useFarmStore } from '@/store/farmsGlobal';
  import { useQuery } from '@tanstack/react-query';
  import { Swiper, SwiperSlide } from 'swiper/react';
  import 'swiper/css'; // Required Swiper styles
  import 'swiper/css/pagination';
  import { Pagination } from 'swiper/modules'; 
 
  
  const severityColor = {
    high: 'red',
    medium: 'orange',
    low: 'yellow',
  };
  
  const AlertsPage = () => {
    const { activeFarmId } = useFarmStore();
    const { t } = useTranslation('alert');
  
    const {
      data: farmNotifications = [],
      isLoading: isFarmLoading,
      error: farmError,
    } = useQuery({
      queryKey: ['farmNotifications', activeFarmId],
      queryFn: () => activeFarmId ? getFarmNotifications(activeFarmId) : Promise.resolve([]),
      enabled: !!activeFarmId, // only fetch if farmId exists
    });

    const {
      data: userNotifications = [],
      isLoading: isUserLoading,
      error: userError,
    } = useQuery({
      queryKey: ['userNotifications'],
      queryFn: getUserNotifications,
    });
  
    const loading = isFarmLoading || isUserLoading;
    const error = farmError || userError;

    const renderNotifications = (notifications: NotificationItem[]) => (
      <Swiper
        modules={[Pagination]}
        style={{ width: '100%' }}
        spaceBetween={16}
        className='alert-swiper'
        loop={notifications.length > 1}
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 2 },
        }}
      >
        {notifications.map((notif) => (
          <SwiperSlide key={notif.id}>
            <Box
              p={4}
              bg="cardBg"
              border="0.1px solid"
              borderColor={`${severityColor[notif.severity]}`}
              borderRadius="md"
              shadow="md"
              height="100%"
            >
              <HStack justify="space-between" align="start">
                <HStack spacing={3}>
                  <Icon
                    as={FiAlertCircle}
                    color={`${severityColor[notif.severity]}.500`}
                    boxSize={5}
                  />
                  <Stack spacing={1}>
                    <Text fontWeight="semibold" fontSize="md" color='textColor'>
                      {notif.title}
                    </Text>
                    <Text fontSize="sm" color="subTextColor">
                      {notif.message}
                    </Text>
                    <Text fontSize="xs" color="textMain">
                      Farm: {notif.farmId} → Pond: {notif.pondId}
                    </Text>
                  </Stack>
                </HStack>
                <Badge colorScheme={severityColor[notif.severity]}>
                  {notif.severity.toUpperCase()}
                </Badge>
              </HStack>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    );
    
  
      return (
        <Box>
          <Heading size="md" mb={6} color="red.500">
            {t('heading')}
          </Heading>
    
          {loading ? (
            <Center py={10}>
              <Spinner color="red.400" size="lg" />
            </Center>
          ) : error ? (
            <Text color="red.500">{t('fetchError')}</Text>
          ) : (
            <>
              {farmNotifications.length > 0 && (
                <Box mb={6}>
                  <Heading size="sm" mb={4}>
                    {t('farmNotifications')}
                  </Heading>
                  {renderNotifications(farmNotifications)}
                </Box>
              )}
    
                {userNotifications.length > 0 && (
              <Box>
                <Heading size="sm" mb={4}>
                  {t('userNotifications')}
                </Heading>
                {renderNotifications(userNotifications)}
              </Box>
            )}

          {farmNotifications.length === 0 && (
            <Box mb={6}>
              <Text textAlign="center" color="gray.500">{t('noFarmAlerts')}</Text>
            </Box>
          )}

            {userNotifications.length === 0 && (
              <Box>
                <Text textAlign="center" color="textLabel">{t('noUserAlerts')}</Text>
              </Box>
            )}
            </>
          )}
        </Box>
      );
    };
    
    export default AlertsPage;