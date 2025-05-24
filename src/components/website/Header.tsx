import {
  Box,
  Flex,
  HStack,
  Button,
  useColorModeValue,
  Spacer,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  VStack,
  Divider,
  Image,
  useBreakpointValue,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import DarkModeToggle from '../DarkModeToggle';
import LanguageSelector from '../LanguageSelector';
import logo from '@/assets/images/aquaintelli-logo.png'; // adjust as needed

const navLinks = [
  { nameKey: 'nav.about', path: '/about' },
  { nameKey: 'nav.solutions', path: '/solutions' },
  { nameKey: 'nav.products', path: '/products' },
];

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation('websiteheader');
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);

  const headerHeight = useBreakpointValue({ base: '64px', md: isScrolled ? '64px' : '80px' });
  const logoSize = useBreakpointValue({ base: '80px', md: isScrolled ? '60px' : '180px' });

  // Scroll listener for shrinking effect
  useEffect(() => {
    const handleScroll = () => {
      // Add a small buffer zone to reduce jitter (e.g., 10px to 30px)
      const scrollTop = window.scrollY;
      setIsScrolled((prev) =>
        scrollTop > 30 ? true : scrollTop < 30 ? false : prev
      );
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bg = useColorModeValue('rgba(255,255,255,0.75)', 'rgba(26,32,44,0.75)');
  const backdrop = 'saturate(180%) blur(10px)';
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <>
      <Box
        position="sticky"
        top="0"
        zIndex="100"
        px={{ base: 4, md: 8 }}
        height={headerHeight}
        transition="all 0.3s ease"
        bg={bg}
        backdropFilter={backdrop}
        borderBottom="1px solid"
        borderColor={borderColor}
      >
        <Flex align="center" h="full">
          {/* Logo */}
          <Box as={RouterLink} to="/" display="flex" alignItems="center">
            <Image src={logo} alt="AquaIntelli Logo" boxSize={logoSize} objectFit="contain" mr={3} />
          </Box>

          {/* Desktop Nav */}
          <HStack spacing={6} ml={6} display={{ base: 'none', md: 'flex' }}>
            {navLinks.map((link) => (
              <Button
                key={link.path}
                as={RouterLink}
                to={link.path}
                variant="ghost"
                fontWeight="medium"
                _hover={{ color: 'blue.500' }}
                color={location.pathname === link.path ? 'blue.500' : 'inherit'}
              >
                {t(link.nameKey)}
              </Button>
            ))}
          </HStack>

          <Spacer />

          {/* Right Actions */}
          <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
            <LanguageSelector />
            <DarkModeToggle />
            <Button
              size="sm"
              colorScheme="blue"
              as={RouterLink}
              to="/login"
              fontWeight="semibold"
            >
              {t('brand.cta')}
            </Button>
          </HStack>

          {/* Mobile Menu Button */}
          <IconButton
            aria-label="Open Menu"
            icon={<HamburgerIcon />}
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            variant="ghost"
            size="md"
            ml={2}
          />
        </Flex>
      </Box>

      {/* Mobile Drawer */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody pt={10}>
            <VStack spacing={4} align="stretch">
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  variant="ghost"
                  onClick={() => {
                    onClose();
                    setTimeout(() => {
                      navigate(link.path);
                    }, 250); // Match Chakra's Drawer close duration
                  }}
                  color={location.pathname === link.path ? 'blue.500' : 'inherit'}
                >
                  {t(link.nameKey)}
                </Button>
              ))}
              <Button
                colorScheme="blue"
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    navigate('/login');
                  }, 250);
                }}
              >
                {t('brand.cta')}
              </Button>
              <Divider />
              <DarkModeToggle />
              <LanguageSelector />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;