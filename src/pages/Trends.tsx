import {
    Box,
    Heading,
    Stack,
    CheckboxGroup,
    Checkbox,
    HStack,
    Text,
    Input,
    Button,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { useState, useRef } from 'react';
  import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
  import html2canvas from 'html2canvas';
  import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

  const dummyData = [
    { time: '10:00', DO: 6.5, Temp: 28.3, PH: 7.5 },
    { time: '11:00', DO: 6.2, Temp: 29.0, PH: 7.6 },
    { time: '12:00', DO: 5.9, Temp: 30.1, PH: 7.8 },
    { time: '13:00', DO: 6.1, Temp: 31.2, PH: 8.0 },
  ];
  
  const availableMetrics = ['DO', 'Temp', 'PH'];
  
  const Trends = () => {
    const [selectedMetrics, setSelectedMetrics] = useState(['DO', 'Temp']);
    const [fromDate, setFromDate] = useState('2025-04-06T10:00');
    const [toDate, setToDate] = useState('2025-04-06T14:00');
    const {t} = useTranslation('wst')
  
    const chartRef = useRef<HTMLDivElement>(null);
  
    const filteredData = dummyData.filter((d) => {
      const ts = new Date(`2025-04-06T${d.time}`).getTime();
      return ts >= new Date(fromDate).getTime() && ts <= new Date(toDate).getTime();
    });
  
    const handleDownload = async () => {
      if (!chartRef.current) return;
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = `water-quality-trends-${format(new Date(), 'yyyyMMdd_HHmm')}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
  
    return (
        <Box bg={useColorModeValue('white', 'gray.800')} borderRadius="lg" p={6} boxShadow="md">
          <Heading size="md" mb={4}>
            {t('weatherStationTrends')}
          </Heading>
  
          <Stack direction={{ base: 'column', md: 'row' }} spacing={6} mb={4} align={{base: 'center', md: 'end'}}>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                <Box>
                  <Text fontSize="sm" mb={1}>{t('from')}</Text>
                  <Input
                    size="sm"
                    type="datetime-local"
                    value={fromDate}
                    onChange={(e: any) => setFromDate(e.target.value)}
                  />
                </Box>
                <Box>
                  <Text fontSize="sm" mb={1}>{t('to')}</Text>
                  <Input
                    size="sm"
                    type="datetime-local"
                    value={toDate}
                    onChange={(e: any) => setToDate(e.target.value)}
                  />
                </Box>
              </Stack>
  
            {/* Metric Selection */}
            <Box>
              <Text fontSize="sm" mb={1}>{t('selectParameters')}</Text>
              <CheckboxGroup value={selectedMetrics} onChange={(val: string[]) => setSelectedMetrics(val as string[])}>
                <HStack spacing={4}>
                  {availableMetrics.map((metric) => (
                    <Checkbox key={metric} value={metric}>
                      {metric}
                    </Checkbox>
                  ))}
                </HStack>
              </CheckboxGroup>
            </Box>
  
            <Button size="sm" colorScheme="blue" onClick={handleDownload}>
              {t('downloadChart')}
            </Button>
          </Stack>
  
          {/* Chart */}
          <Box ref={chartRef} overflowX="auto">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedMetrics.includes('DO') && (
                  <Line type="monotone" dataKey="DO" stroke="#38A169" strokeWidth={2} dot={false} />
                )}
                {selectedMetrics.includes('Temp') && (
                  <Line type="monotone" dataKey="Temp" stroke="#DD6B20" strokeWidth={2} dot={false} />
                )}
                {selectedMetrics.includes('PH') && (
                  <Line type="monotone" dataKey="PH" stroke="#3182CE" strokeWidth={2} dot={false} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>
    );
  };
  
  export default Trends;