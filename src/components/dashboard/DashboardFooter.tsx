import { Box, Text, Flex, Link, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const DashboardFooter = () => {
  const navigate = useNavigate();
  
  const {t} = useTranslation('dsfooter')
  return (
    <Box
      as="footer"
      w="full"
      py={4}
      px={6}
      mt="auto"
      bg="bg"
      borderTop="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Flex
        justify={{ base: 'center', md: 'space-between' }}
        align="center"
        direction={{ base: 'column', md: 'row' }}
        gap={2}
      >
        <Text fontSize="sm" color="iconColor">
        {t('copyright', { year: new Date().getFullYear() })}
        </Text>

        <Flex gap={4}>
          <Link href="https://dhya.in" isExternal fontSize="sm" color="iconColor">
            {t("website")}
          </Link>
          <Link onClick={() => navigate('/support')} fontSize="sm" color="iconColor">
          {t("support")}
          </Link>
          <Link onClick={() => navigate('/plans')} fontSize="sm" color="iconColor">
          {t("plans")}
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default DashboardFooter;