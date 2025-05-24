import {
    Box,
    Flex,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Text,
    VStack,
    Icon,
  } from '@chakra-ui/react';
  import { useAuthStore } from '@/hooks/useAuthStore';
  import { FiMapPin, FiDroplet, FiThermometer, FiTrendingUp } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';


interface DashboardOverviewProps {
  totalPonds: number;
  avgDO: number | null;
  avgTemp: number | null;
}

  
  const DashboardOverview = ({ totalPonds, avgDO, avgTemp }: DashboardOverviewProps) => {
    const { t } = useTranslation('dashboardoverview');
    useAuthStore();

    const statsData = [
      {
        label: t('pondsMonitored'),           // Translation for label
        value: totalPonds.toString(),
        helpText: t('monitoringType'),        // Translation for help text
        icon: FiMapPin,
      },
      {
        label: t('avgDO'),
        value: avgDO !== null ? `${avgDO} mg/L` : '-',
        helpText: t('acrossAllPonds'),
        icon: FiDroplet,
      },
      {
        label: t('avgTemp'),
        value: avgTemp !== null ? `${avgTemp}°C` : '-',
        helpText: t('measuredLastHour'),
        icon: FiThermometer,
      },
      {
        label: t('productivityScore'),
        value: '82%',
        helpText: t('basedOnWaterQuality'),
        icon: FiTrendingUp,
      },
    ];
  
    return (
      <VStack spacing={6} align="stretch">
        {/* Welcome Header */}
      
  
  
        {/* Farm Stats Summary */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            helpText={stat.helpText}
          />
        ))}
      </SimpleGrid>
  
        {/* Advisory Box */}
        <Box bg="green.50" border="1px dashed" borderColor="green.300" p={4} rounded="md">
          <Text fontSize="sm" color="green.800">
            🌿 Based on water quality, consider increasing aeration tonight for Pond 3.
          </Text>
        </Box>
      </VStack>
    );
  };
  
  export default DashboardOverview;
  
  interface StatCardProps {
    label: string;
    value: string;
    helpText?: string;
    icon: any;
  }
  
  const StatCard = ({ label, value, helpText, icon }: StatCardProps) => {
    
  
    return (
      <Stat
        p={4}
        bg="cardBg"
        shadow="sm"
        rounded="md"
        border="1px solid"
        borderColor="cardBorder"
      >
        <Flex align="center" gap={2} mb={2}>
          <Icon as={icon} color="green.500" boxSize={5} />
          <StatLabel fontSize="sm">{label}</StatLabel>
        </Flex>
        <StatNumber fontSize="lg">{value}</StatNumber>
        {helpText && <StatHelpText fontSize="xs">{helpText}</StatHelpText>}
      </Stat>
    );
  };