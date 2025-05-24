import {
    Box,
    Stack,
    FormControl,
    FormLabel,
    Input,
    Divider,
    Button,
  } from '@chakra-ui/react';
  import { useAuthStore } from '@/hooks/useAuthStore';
  import { useTranslation } from 'react-i18next';
  import { useDisclosure } from '@chakra-ui/react';
  import ChangePasswordModal from '@/components/modals/ChangePasswordModal';
  import ChangeMobileModal from '@/components/modals/ChangeMobileModal';
  
  const UserSettings = () => {
    const { user } = useAuthStore();
    const { t } = useTranslation('settings');
  
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
      isOpen: isMobileModalOpen,
      onOpen: openMobileModal,
      onClose: closeMobileModal,
    } = useDisclosure();
  
    return (
      <Box
        border="1px solid"
        borderColor="manualBorderColor"
        maxW="2xl"
        mx="auto"
        mt={1}
        p={6}
        borderRadius="lg"
        bg="cardBg"
        boxShadow="md"
      >
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>{t('tenantId')}</FormLabel>
            <Input value={user?.tenantId || 'N/A'} isReadOnly />
          </FormControl>
  
          <FormControl>
            <FormLabel>{t('name')}</FormLabel>
            <Input value={user?.name || ''} isReadOnly />
          </FormControl>
  
          <FormControl>
            <FormLabel>{t('email')}</FormLabel>
            <Input value={user?.email || ''} isReadOnly />
          </FormControl>
  
          <Divider my={4} />
  
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={3}
            mt={5}
            justifyContent={{ base: 'center', md: 'flex-end' }}
            width="100%"
          >
            <Button
              colorScheme="gray"
              variant="outline"
              size="sm"
              w={{ base: '100%', md: 'fit-content' }}
              onClick={onOpen}
            >
              Change Password
            </Button>
            <Button
              colorScheme="gray"
              variant="outline"
              size="sm"
              w={{ base: '100%', md: 'fit-content' }}
              onClick={openMobileModal}
            >
              Change Mobile Number
            </Button>
          </Stack>
  
          <Button colorScheme="red" variant="outline" isDisabled>
            {t('deleteAccount')}
          </Button>
        </Stack>
  
        <ChangePasswordModal isOpen={isOpen} onClose={onClose} />
        <ChangeMobileModal isOpen={isMobileModalOpen} onClose={closeMobileModal} />
      </Box>
    );
  };
  
  export default UserSettings;
  