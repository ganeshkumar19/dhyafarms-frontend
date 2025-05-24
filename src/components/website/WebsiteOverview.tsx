import { useRegisterAuthStore } from '@/store/registerAuth';
import { VStack, Text, Button, HStack, Heading, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

interface WebsiteOverviewProps {
  onSignInClick: () => void;
}

interface OverviewArray {
  text: string;
  bg: string;
}

const WebsiteOverview: React.FC<WebsiteOverviewProps> = ({ onSignInClick }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('weboverview');

  const token = useRegisterAuthStore.getState().token || localStorage.getItem('token');

  const handleButtonClick = () => {
    if (token) {
      navigate('/dashboard');
    } else {
      onSignInClick();
    }
  };

  // Memoized translation of overview points
  const overviewArray: OverviewArray[] = useMemo(() => {
    const translatedPoints = t('points', { returnObjects: true }) as string[];
    return [
      { text: translatedPoints[0], bg: 'blue.400' },
      { text: translatedPoints[1], bg: 'green.400' },
      { text: translatedPoints[2], bg: 'orange.400' },
    ];
  }, [i18n.language, t]);

  return (
    <Box display="flex" justifyContent="center" width="100%" minH='100vh' bg="bg">
      <VStack spacing={8} maxW="lg" my={9}>
        <Heading textAlign="center">{t('heading')}</Heading>

        <Box display="flex" flexDirection="column" gap={6} p={2}>
          <Text textAlign="center">{t('description')}</Text>
        </Box>

        <VStack align="start" spacing={4} p={3}>
          {overviewArray.map((or, index) => (
            <HStack key={index}>
              <Box w={3} h={3} borderRadius="full" bg={or.bg} />
              <Text>{or.text}</Text>
            </HStack>
          ))}
        </VStack>

        <Box
          textAlign="center"
          maxW="md"
          mx="auto"
          p={6}
          px={8}
          bg={token ? 'transparent' : 'bg'}
          rounded="md"
          shadow="md"
          border={token ? 'none' : '1px solid'}
          borderColor="gray.200"
        >
          <Button onClick={handleButtonClick} width="100%" mb={4}>
            {token ? t('enterDashboard') : t('signIn')}
          </Button>

          {!token && (
            <Box textAlign="center">
              <Text fontSize="sm">
                {t('noAccount')}{' '}
                <Text
                  as="span"
                  color="blue.600"
                  fontWeight="bold"
                  cursor="pointer"
                  ml="1"
                  onClick={() => navigate('/get-started/step1')}
                >
                  {t('signUp')}
                </Text>
              </Text>
            </Box>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default WebsiteOverview;