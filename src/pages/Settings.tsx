import SettingsNotifications from '@/components/dashboard/settings/SettingsNotifications';
import SettingsPlans from '@/components/dashboard/settings/SettingsPlans';
import SettingsPreferences from '@/components/dashboard/settings/SettingsPreferences';
import UserSettings from '@/components/dashboard/settings/UserSettings';
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t } = useTranslation('settings');

  const tabItems = [
    { label: t('userSettings'), component: <UserSettings /> },
    { label: t('preferences'), component: <SettingsPreferences/>},
    { label: t('notifications'), component: <SettingsNotifications/> },
    { label: t('billing'), component: <SettingsPlans/> },
  ];

  return (
    <Box>
      <Heading mb={6} color="subTextColor">
        {t('accountSettings')}
      </Heading>

      <Tabs variant="enclosed" colorScheme="blue">
      <TabList
  borderBottom="2px solid"
  borderColor="borderColor"
  overflowX={{ base: 'auto', md: 'visible' }}
  whiteSpace="nowrap"
  sx={{
    scrollbarWidth: 'none', // Firefox
    '&::-webkit-scrollbar': { display: 'none' }, // Chrome, Safari
  }}
>
  {tabItems.map((tab, index) => (
    <Tab
      key={index}
      flexShrink={0}
      _selected={{
        border: 0,
        borderBottom: '2px solid',
        borderColor: 'subTextColor',
        color: 'subTextColor',
      }}
    >
      {tab.label}
    </Tab>
  ))}
</TabList>

        <TabPanels>
          {tabItems.map((tab, index) => (
            <TabPanel key={index}>{tab.component}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Settings;