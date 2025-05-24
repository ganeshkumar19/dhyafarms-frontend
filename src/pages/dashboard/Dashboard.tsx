import { Box, Heading, Stack, Text } from '@chakra-ui/react';

// Dashboard Sections
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import PondOverviewCard from '@/components/dashboard/PondOverviewCard';
import FishOverviewCard from '@/components/dashboard/FishOverviewCard';
import LiveDevicesPanel from '@/components/dashboard/LiveDevicesPanel';
import DeviceChartsPanel from '@/components/dashboard/DeviceChartsPanel';
import PondLogsPanel from '@/components/dashboard/PondLogsPanel';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules'; 
import { useQuery } from '@tanstack/react-query';
import { useFarmStore } from '@/store/farmsGlobal';
import { getFarmOverview } from '@/api/farm';
import 'swiper/css'; // Required Swiper styles
import 'swiper/css/pagination';
import { formatRelativeTime, getDaysAgo } from '@/helpers/dateHelpers';


const Dashboard = () => {
  const { activeFarmId } = useFarmStore();
  const { data, isLoading, isError, error} = useQuery({
    queryKey: ['farmOverview', activeFarmId],
    queryFn: () => getFarmOverview(activeFarmId || ''),
    enabled: !!activeFarmId,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const pondData = data?.pond ?? {
    total: 0,
    devices: 0,
    do_mg_l: null,
    temp_c: null,
    updatedAt: ''
  };

  console.log('fishdata', data)

  const fishSpeciesData = data?.fish || [];


  const { t } = useTranslation('dbheadings');
  return (
      <Stack spacing={6} px={{ base: 4, md: 6 }} py={6}>
        {/* ✅ Overview Section */}
        <DashboardOverview 
         totalPonds={pondData.total}
         avgDO={pondData.do_mg_l}
         avgTemp={pondData.temp_c}/>

        {/* ✅ Pond & Fish Summary */}
        <Stack direction={{ base: 'column', md: 'row' }} spacing={6} align="stretch">
        <PondOverviewCard
            totalPonds={pondData.total}
            totalDevices={pondData.devices}
            avgDO={pondData.do_mg_l}
            avgTemp={pondData.temp_c}
            lastUpdated={formatRelativeTime(pondData.updatedAt)}
            alertMessage="Static alert"
            insightMessage="Static insight"
            isLoading={isLoading}
            isError={isError}
            error={error}
          />

<Box flex={1} maxW={{ base: "100%", md: "50%" }}>
  <Swiper
    modules={[Pagination]}
    style={{ width: "100%" }}
    spaceBetween={16}
    slidesPerView={1}
    loop={fishSpeciesData.length > 1} 
    pagination={{ clickable: true }}
    className="custom-swiper"
  >
    {fishSpeciesData.map((data, idx) => (
      <SwiperSlide key={idx}>
        <FishOverviewCard {...data}    lastFed={getDaysAgo(data.lastFeed)} alertMessage='static alert' insightMessage='static insight'/>
      </SwiperSlide>
    ))}
  </Swiper>
</Box>

        </Stack>

        {/* ✅ Live Device Cards */}
        <Box w="full" overflow="hidden">
  <Heading size="md" mb={2}>
    {t("liveDevices")}
  </Heading>
  <Text fontSize="sm" color="gray.600" mb={4}>
    {t("liveDevicesDesc")}
  </Text>
  <LiveDevicesPanel />
</Box>

        {/* ✅ Device Charts */}
        <DeviceChartsPanel />

        {/* ✅ Historical Sensor Trends 
        <Box>
          <Heading size="md" mb={2}>
            {t("sensorTrends")}
          </Heading>
          <Text fontSize="sm" color="gray.600" mb={4}>
          {t("sensorTrendsDesc")}
          </Text>
          <SensorTrendChart />
        </Box>*/}

        {/* ✅ Pond Logs */}
        <Box>
          <Heading size="md" mb={2}>
           {t("recentPondLogs")}
          </Heading>
          <Text fontSize="sm" color="gray.600" mb={4}>
          {t("recentPondLogsDesc")}
          </Text>
          <PondLogsPanel />
        </Box>
      </Stack>
  );
};

export default Dashboard;