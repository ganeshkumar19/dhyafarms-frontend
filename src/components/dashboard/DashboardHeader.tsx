import {
    Box,
    Flex,
    Text,
    Button,
    IconButton,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    HStack,
    VStack,
    Stack,
    Show,
    Spinner,
  } from '@chakra-ui/react';
  import { ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons';
  import { FiPhoneCall, FiLogOut, FiUser } from 'react-icons/fi';
  import { useAuthStore } from '@/hooks/useAuthStore';
  import { Suspense, useEffect } from 'react';
  import { Farm } from '@/types/models';
  import { useNavigate } from 'react-router-dom'; // ✅ import your toggle
  import LanguageSelector from '../LanguageSelector';
  import { useTranslation } from 'react-i18next';
  import { useQuery, useQueryClient } from '@tanstack/react-query';
  import { getFarms } from '@/api/farm'; // adjust path
  import { useDisclosure } from '@chakra-ui/react';
  import AddFarmModal from '../modals/AddFarmModal';
  import { useFarmStore } from '@/store/farmsGlobal';
import DarkModeToggle from '../DarkModeToggle';
    
  interface DashboardHeaderProps {
    onMenuClick?: () => void;
  }
  
  const DashboardHeader = ({ onMenuClick }: DashboardHeaderProps) => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const {
      isOpen: isAddFarmOpen,
      onOpen: openAddFarm,
      onClose: closeAddFarm
    } = useDisclosure();
    const queryClient = useQueryClient();
    const {
      farms,
      setFarms,
      setActiveFarmId,
      setActiveFarmName,
      activeFarmId,
      activeFarmName,
    } = useFarmStore();
    const { t } = useTranslation('dsheader');
  
    const { data, isLoading } = useQuery<Farm[]>({
      queryKey: ['farms', user?.tenantId],
      queryFn: getFarms,
      enabled: !!user?.tenantId,
      refetchOnWindowFocus: false,
    });
  
    useEffect(() => {
      if (data && data.length > 0) {
        setFarms(data);
  
        // Only set active if not already set
        if (!activeFarmId) {
          setActiveFarmId(data[0].id);
          setActiveFarmName(data[0].name);
        }
      }
    }, [data]);

    const handleLogout = () => {
      logout(); // clear the store
      navigate('/login'); // safely navigate here
    };

  
    return (
      <Box
        w="full"
        px={{ base: 4, md: 6 }}
        py={4}
        bg="bg"
        borderBottom="1px solid"
        borderColor="borderColor"
        position="sticky"
        top={0}
        zIndex={10}
        minH="80px"
      >
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align={{ base: 'center', sm: 'center' }}
          gap={{ base: 4, md: 0 }}
        >
          {/* Left Section */}
          <HStack spacing={4}>
          <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  size="sm"
                  variant="outline"
                  fontWeight="medium"
                >
                  {activeFarmName || t('selectFarm')}
                </MenuButton>
                <MenuList>
                  {isLoading ? (
                    <MenuItem isDisabled>{t('loadingFarms') || 'Loading...'}</MenuItem>
                  ) : (
                    farms.map((farm) => (
                      <MenuItem
                        key={farm.id}
                        onClick={() => {
                          setActiveFarmId(farm.id);
                          setActiveFarmName(farm.name);
                        }}
                      >
                        {farm.name}
                      </MenuItem>
                    ))
                  )}
                  <MenuItem fontWeight="bold" onClick={openAddFarm}>
                    {t('addNewFarm')}
                  </MenuItem>
                </MenuList>
              </Menu>
  
            <VStack spacing={0} align="start" display={{ base: 'none', md: 'flex' }}>
              {user ? (
                <>
                  <Text fontSize="xs" color="gray.500">{t('welcome')}</Text>
                  <Text fontSize="sm" fontWeight="semibold">{user.name}</Text>
                </>
              ) : (
                <HStack spacing={1}>
                  <Spinner size="xs" />
                    <Text fontSize="sm">{t('loadingUser')}</Text>
                </HStack>
              )}
            </VStack>
          </HStack>
          <Stack
            direction={{ base: 'row', sm: 'row' }}
            spacing={3}
            justify="center"
            align="center"
            width={{ base: '100%', sm: 'auto' }}
          >
            {/* 🌙 Dark Mode Toggle */}
            <DarkModeToggle/>
          <Suspense fallback={<Box w="32px" h="32px" />}>
            <LanguageSelector />
          </Suspense>
  
            <Button
              leftIcon={<FiPhoneCall />}
              size="sm"
              colorScheme="green"
              w={{ base: 'full', sm: 'auto' }}
            >
              {t('callSupport')}
            </Button>
  
            <Menu>
              <MenuButton
                as={Avatar}
                size="sm"
                cursor="pointer"
                src={user?.avatarUrl || undefined}
              />
              <MenuList>
                <MenuItem icon={<FiUser />} onClick={() => navigate('/profile')}>
                {t('profile')}
                </MenuItem>
                <MenuItem
                  icon={<FiLogOut />}
                  onClick={handleLogout}
                >
                  {t('logout')}
                </MenuItem>
              </MenuList>
            </Menu>
  
            <Show below="lg">
            <IconButton
              icon={<HamburgerIcon />}
              aria-label="Open Menu"
              size="sm"
              variant="ghost"
              onClick={onMenuClick}
            />
          </Show>
                    </Stack>
                  </Flex>
                  <AddFarmModal
                        isOpen={isAddFarmOpen}
                        onClose={closeAddFarm}
                        onFarmCreated={async () => {
                          await queryClient.invalidateQueries({ queryKey: ['farms'] });
                        }}
                      />
                </Box>

              );
            };
  
  export default DashboardHeader;