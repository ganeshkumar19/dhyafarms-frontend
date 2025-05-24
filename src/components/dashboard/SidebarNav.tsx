import { useMemo } from 'react';
import {
  Box,
  VStack,
  Text,
  Divider,
  Icon,
  Link,
  useColorModeValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
} from '@chakra-ui/react';
import {
  FiHome,
  FiMapPin,
  FiCpu,
  FiEdit,
  FiAlertCircle,
  FiHelpCircle,
  FiSettings,
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SidebarNavProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: () => void;
}

const SidebarNav = ({ isOpen, onClose, onNavigate }: SidebarNavProps) => {
  const { t } = useTranslation('sidebar');
  const navigate = useNavigate();
  const location = useLocation();
  const bg = useColorModeValue('gray.50', 'gray.800');
  const hoverBg = useColorModeValue('green.200', 'green.600');
  const activeBg = useColorModeValue('green.100', 'green.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  const navItems = useMemo(() => [
    { label: t('dashboard'), icon: FiHome, path: '/dashboard' },
    { label: t('farmsAndPonds'), icon: FiMapPin, path: '/farms' },
    { label: t('devices'), icon: FiCpu, path: '/devices' },
    { label: t('manualEntry'), icon: FiEdit, path: '/manual-entry' },
  ], [t]);

  const insightsItems = useMemo(() => [
    { label: t('alerts'), icon: FiAlertCircle, path: '/alerts' },
    // { label: t('waterQualityTrends'), icon: FiTrendingUp, path: '/trends' },
  ], [t]);
  
  const supportItems = useMemo(() => [
    { label: t('support'), icon: FiHelpCircle, path: '/support' },
    // { label: t('plansAndSubscription'), icon: FiCreditCard, path: '/plans' },
    { label: t('settings'), icon: FiSettings, path: '/settings' },
  ], [t]);

  const renderLinks = (items: typeof navItems) =>
    items.map((item) => {
      const isActive = location.pathname === item.path;
      return (
        <Link
          key={item.path}
          onClick={() => {
            navigate(item.path);
            onClose();
            onNavigate?.();
          }}
          display="flex"
          alignItems="center"
          gap={3}
          py={2}
          px={3}
          w="100%"
          bg={isActive ? activeBg : 'transparent'}
          _hover={{ bg: hoverBg }}
          cursor="pointer"
          fontWeight={isActive ? 'semibold' : 'normal'}
          fontSize="sm"
          color={textColor}
        >
          <Icon as={item.icon} boxSize={4} />
          {item.label}
        </Link>
      );
    });

  const SidebarContent = () => (
    <VStack align="start" spacing={6} w="full">
      <Text fontWeight="bold" fontSize="xl" ml={3}>
        {t('dhyaFarms')}
      </Text>
      <VStack align="start" spacing={1} w="full">
        {renderLinks(navItems)}
      </VStack>

      <Divider />

      <VStack align="start" spacing={1} w="full">
        {renderLinks(insightsItems)}
      </VStack>

      <Divider />

      <VStack align="start" spacing={1} w="full">
        {renderLinks(supportItems)}
      </VStack>
    </VStack>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Box
        w="250px"
        bg={bg}
        h="100vh"
        borderRight="1px solid"
        borderColor="gray.200"
        px={0}
        pr={0}
        py={6}
        position="fixed"
        top={0}
        left={0}
        display={{ base: 'none', md: 'block' }}
      >
        <SidebarContent />
      </Box>

      {/* Mobile Sidebar Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={bg}>
          <DrawerCloseButton />
          <DrawerBody>
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SidebarNav;
