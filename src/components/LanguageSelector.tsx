import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Text,
  HStack,
} from '@chakra-ui/react';
import { FaCheck, FaGlobe } from 'react-icons/fa';
import i18n from 'i18next';
import { useEffect, useState } from 'react';
import { handleChangeLanguage, languages } from '@/helpers/i18nHelpers';
import { useAuthStore } from '@/hooks/useAuthStore';


const LanguageSelector = () => {
  const {user} = useAuthStore();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  useEffect(() => {
    // If user has a language set, use it
    if (user?.language && user.language !== i18n.language) {
      i18n.changeLanguage(user.language);
    }

    const handleLanguageChange = () => {
      setCurrentLang(i18n.language);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [user?.language]);



  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<FaGlobe />}
        size="sm"
        variant="ghost"
        aria-label="Language selector"
      />
      <MenuList>
        {languages.map(({ code, label }) => (
          <MenuItem
            key={code}
            onClick={() => handleChangeLanguage(code)}
            bg={currentLang === code ? 'bg' : 'transparent'}
            _hover={{ bg: 'hoverBg' }}
          >
            <HStack justify="space-between" w="full">
              <Text color="textColor">{label}</Text>
              {currentLang === code && <FaCheck size="0.75rem" />}
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default LanguageSelector;

