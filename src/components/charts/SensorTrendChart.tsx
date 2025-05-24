// src/components/dashboard/SensorTrendChart.tsx

import {
    Box,
    Heading,
    Select,
    useColorModeValue,
    Flex,
    Stack,
    Button,
  } from '@chakra-ui/react';
  import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
  } from  'chart.js';
  import { Line } from 'react-chartjs-2';
  import { useRef, useState } from 'react';
  import html2canvas from 'html2canvas';
  import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
  
  // Register ChartJS components
  ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);
  
  // Dummy time-series data
  const dummyData = {
    do: [
      { time: '09:00', value: 6.5 },
      { time: '10:00', value: 6.2 },
      { time: '11:00', value: 5.8 },
      { time: '12:00', value: 5.4 },
      { time: '13:00', value: 5.9 },
    ],
    temp: [
      { time: '09:00', value: 28.1 },
      { time: '10:00', value: 29.3 },
      { time: '11:00', value: 30.2 },
      { time: '12:00', value: 30.8 },
      { time: '13:00', value: 31.1 },
    ],
    ph: [
      { time: '09:00', value: 7.2 },
      { time: '10:00', value: 7.4 },
      { time: '11:00', value: 7.6 },
      { time: '12:00', value: 7.8 },
      { time: '13:00', value: 8.0 },
    ],
  };
  
  const SensorTrendChart = () => {
    const [selectedParam, setSelectedParam] = useState<'do' | 'temp' | 'ph'>('do');
    const chartRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation('sensorChart');
  
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
  
    const colorMap: Record<string, string> = {
      do: '#38A169',   // green
      temp: '#DD6B20', // orange
      ph: '#3182CE',   // blue
    };
  
    const labelMap: Record<string, string> = {
      do: t('select.do'),
      temp: t('select.temp'),
      ph: t('select.ph'),
    };
    
  
    const chartData = dummyData[selectedParam];
  
    const data = {
      labels: chartData.map((d) => d.time),
      datasets: [
        {
          label: labelMap[selectedParam],
          data: chartData.map((d) => d.value),
          fill: false,
          borderColor: colorMap[selectedParam],
          backgroundColor: colorMap[selectedParam],
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: labelMap[selectedParam],
          },
        },
        x: {
          title: {
            display: true,
            text: t('xAxis'),
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
        },
        tooltip: {
          callbacks: {
            label: (context: any) => `${labelMap[selectedParam]}: ${context.parsed.y}`,
          },
        },
      },
    };
  
    const handleDownload = async () => {
      if (!chartRef.current) return;
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = `sensor-trend-${selectedParam}-${format(new Date(), 'yyyyMMdd_HHmm')}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
  
    return (
      <Box
        bg={bg}
        p={5}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        shadow="sm"
      >
        {/* Header Controls */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'center', md: 'center' }}
          mb={4}
          gap={3}
        >
          <Heading size="sm">{t('heading')}</Heading>
  
          <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
            <Select
              size="sm"
              value={selectedParam}
              onChange={(e: { target: { value: string; }; }) => setSelectedParam(e.target.value as 'do' | 'temp' | 'ph')}
              width={{ base: 'full', sm: '200px' }}
            >
              <option value="do">{t('select.do')}</option>
              <option value="temp">{t('select.temp')}</option>
              <option value="ph">{t('select.ph')}</option>
            </Select>
            <Button size="sm" colorScheme="blue" onClick={handleDownload}>
            {t('download')}
            </Button>
          </Stack>
        </Flex>
  
        {/* Chart Container */}
        <Box ref={chartRef} height={{ base: '300px', md: '400px' }}>
          <Line data={data} options={options} />
        </Box>
      </Box>
    );
  };
  
  export default SensorTrendChart;