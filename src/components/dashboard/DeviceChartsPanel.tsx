// src/components/dashboard/WeatherChartsPanel.tsx

import {
    Box,
    Heading,
    Stack,
    Checkbox,
    CheckboxGroup,
    Text,
    Button,
    HStack,
    Input,
    Wrap,
    WrapItem,
  } from '@chakra-ui/react';
  import { useRef, useState, useMemo, useEffect } from 'react';
  import html2canvas from 'html2canvas';
  import { format } from 'date-fns';
  import { useTranslation } from 'react-i18next';
import WeatherTrendChart from '../charts/WeatherTrendChart';
import { fetchWeatherData } from '@/api/device';
import { useFarmStore } from '@/store/farmsGlobal';
import { useQuery } from '@tanstack/react-query';
  
  // ⚠️ Replace with real WS data
  
  
  const DeviceChartsPanel = () => {
    const { t } = useTranslation('wst');
    const today = new Date();
    const [fromDate, setFromDate] = useState<string>(format(today, 'yyyy-MM-dd') + 'T00:00');
    const [toDate, setToDate] = useState<string>(format(new Date(today.getTime() + 2 * 60 * 60 * 1000), 'yyyy-MM-dd') + 'T02:00');
    const { activeFarmId } = useFarmStore();
    const chartRef = useRef<HTMLDivElement>(null);
     const formatDate = (date: string) => format(new Date(date), 'yyyy-MM-dd');
  
    const { data: weatherData, isLoading: isLoadingWeatherData, error } = useQuery({
      queryKey: ['weatherData', activeFarmId, fromDate, toDate],
      queryFn: () => fetchWeatherData(activeFarmId || '', formatDate(fromDate), formatDate(toDate)),
      enabled: !!activeFarmId && !!fromDate && !!toDate,
      retry: false
    });
  
    const { availableDevices, availableMetrics } = useMemo(() => {
      const devices = new Set<string>();
      const metrics = new Set<string>();
  
      if (weatherData) {
        Object.keys(weatherData).forEach((device) => {
          devices.add(device.replace('device ', ''));
          const deviceData = weatherData[device];
          if (deviceData?.trends?.length) {
            const sample = deviceData.trends[0];
            Object.keys(sample).forEach((metricKey) => {
              if (metricKey !== 'time') metrics.add(metricKey);
            });
          }
        });
      }
  
      return {
        availableDevices: Array.from(devices),
        availableMetrics: Array.from(metrics),
      };
    }, [weatherData]);
  
    const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
    const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  
    useEffect(() => {
      if (availableDevices.length) setSelectedDevices(availableDevices);
      if (availableMetrics.length) setSelectedMetrics(availableMetrics);
    }, [availableDevices, availableMetrics]);
  
    const selectedKeys = selectedDevices.flatMap((device) =>
      selectedMetrics.map((metric) => `${device.replace('-', '')}_${metric}`)
    );
  
    const filteredData = useMemo(() => {
      if (!weatherData) return [];
    
      // 1. Collect all time points across devices
      const allTimestamps = new Set<string>();
      Object.keys(weatherData).forEach((device) => {
        const trends = weatherData[device]?.trends || [];
        trends.forEach((trend: any) => {
          allTimestamps.add(trend.time);
        });
      });
    
      const sortedTimestamps = Array.from(allTimestamps)
        .sort()  // Sort timestamps in ascending order
        .reverse() // Reverse to get the most recent first
        .slice(0, 5); // Take the last 5 timestamps
    
      // 2. Build a list for each time (only including the most recent 5 timestamps)
      const finalData = sortedTimestamps.map((timestamp) => {
        const row: any = { time: timestamp };
    
        Object.keys(weatherData).forEach((device) => {
          const cleanDeviceName = device.replace('device ', '').replace('-', '');
          const trendAtThisTime = weatherData[device]?.trends?.find((t: any) => t.time === timestamp);
          if (trendAtThisTime) {
            row[`${cleanDeviceName}_temp`] = trendAtThisTime.temp;
            row[`${cleanDeviceName}_humidity`] = trendAtThisTime.humidity;
            row[`${cleanDeviceName}_wind`] = trendAtThisTime.wind;
            row[`${cleanDeviceName}_rain`] = trendAtThisTime.rain;
          }
        });
    
        return row;
      });
    
      return finalData;
    }, [weatherData]);
    
    
  
    const handleDownload = async () => {
      if (!chartRef.current) return;
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = `weather-trends-${format(new Date(), 'yyyyMMdd_HHmm')}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };

    const renderChart = () => {
      if (isLoadingWeatherData) {
        return <Text>Loading...</Text>;
      }
  
      if (error || !weatherData || Object.keys(weatherData).length === 0) {

        return <Box display='flex' justifyContent='center' alignItems='center' width='100%' mt={4}>
          <Text>No data available within the given range</Text>
          </Box>;
      }
  
      return <WeatherTrendChart data={filteredData} selectedKeys={selectedKeys} />;
    };
  
  
    return (
      <Box bg="cardBg" p={5} border="1px solid" borderColor="cardBorder" borderRadius="lg" shadow="sm">
        <Heading size="sm" mb={4} textAlign={{ base: 'center', md: 'left'}}>
          ⛅ {t('weatherStationTrends')}
        </Heading>
  
        <Stack direction={{ base: 'column', md: 'row' }} spacing={6} mb={4} align={{ base: 'stretch', md: 'end' }}>
          <HStack spacing={3} flexWrap="wrap">
            <Box>
              <Text fontSize="xs" mb={1}>{t("from")}</Text>
              <Input
                size="sm"
                type="datetime-local"
                value={fromDate}
                onChange={(e: any) => setFromDate(e.target.value)}
              />
            </Box>
            <Box>
              <Text fontSize="xs" mb={1}>{t("to")}</Text>
              <Input
                size="sm"
                type="datetime-local"
                value={toDate}
                onChange={(e: any) => setToDate(e.target.value)}
              />
            </Box>
          </HStack>
  
          <Stack spacing={5} direction={{ base: 'row' }} flexWrap="wrap">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" mb={1}>Devices</Text>
              <CheckboxGroup
                value={selectedDevices}
                onChange={(val: any) => setSelectedDevices(val as string[])}
              >
                <Wrap spacing={2}>
                  {availableDevices.map((device) => (
                    <WrapItem key={device}>
                      <Checkbox value={device} size="sm">{device}</Checkbox>
                    </WrapItem>
                  ))}
                </Wrap>
              </CheckboxGroup>
            </Box>
  
            <Box>
              <Text fontSize="xs" fontWeight="semibold" mb={1}>Metrics</Text>
              <CheckboxGroup
                value={selectedMetrics}
                onChange={(val: any) => setSelectedMetrics(val as string[])}
              >
                <Wrap spacing={2}>
                  {availableMetrics.map((metric) => (
                    <WrapItem key={metric}>
                      <Checkbox value={metric} size="sm">{metric}</Checkbox>
                    </WrapItem>
                  ))}
                </Wrap>
              </CheckboxGroup>
            </Box>
          </Stack>
  
          <Box display="flex" alignItems="center" justifyContent="center">
            <Button size="sm" colorScheme="blue" onClick={handleDownload}>
              {t('downloadChart')}
            </Button>
          </Box>
        </Stack>
  
        <Box ref={chartRef}>
        {renderChart()}
        </Box>
      </Box>
    );
  };
  
  export default DeviceChartsPanel;