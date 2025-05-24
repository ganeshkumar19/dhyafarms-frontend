import { updateUserSettings } from '@/api/preferences';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Heading, Box, Text, Flex, Switch } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const SettingsNotifications = () => {
  const [isEmailEnabled, setIsEmailEnabled] = useState(true); // default ON
  const {t} = useTranslation('settings')

  const {user} = useAuthStore()

  useEffect(() => {
    if (user?.emailNotify !== undefined) {
      setIsEmailEnabled(user.emailNotify);
    }
  }, [user]);


  const handleToggle = async () => {
    const newValue = !isEmailEnabled;
    setIsEmailEnabled(newValue);
  
    try {
      await updateUserSettings({ emailNotify: newValue });
    } catch (err) {
      console.error('❌ Failed to update email notification setting:', err);
    }
  };
  

  return (
    <Box
      border="1px solid"
      borderColor="manualBorderColor"
      maxW="2xl"
      mx="auto"
      mt={4}
      p={6}
      borderRadius="lg"
      bg="cardBg"
      boxShadow="md"
    >
      <Heading size="md" mb={8}>
        {t('notificationsAndAlerts')}
      </Heading>

      <Flex justify="space-between" align="center" border='1px solid' borderColor={"manual"} borderRadius={4} p={3} my={3}>
        <Box>
          <Text fontWeight="medium" color="textMain">{t('emailNotifications')}</Text>
          <Text fontSize="sm" color="subTextColor">
           {t('receiveImportantAlerts')}
          </Text>
        </Box>
        <Switch
          isChecked={isEmailEnabled}
          onChange={handleToggle}
          colorScheme="teal"
        />
      </Flex>
    </Box>
  );
};

export default SettingsNotifications;
