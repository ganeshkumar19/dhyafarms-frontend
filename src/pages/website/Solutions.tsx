import {
  Box,
  Heading,
  Text,
  VStack,
  Icon,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';
import { FaFish, FaMicrochip, FaChartLine } from 'react-icons/fa';
import { GiWaterDrop, GiReceiveMoney } from 'react-icons/gi';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from '@chakra-ui/react';

const iconMap = [FaFish, GiWaterDrop, FaMicrochip, FaChartLine, GiReceiveMoney];

const Solutions = () => {
  const { t } = useTranslation('solutions'); // Assuming namespace is "solutions"
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // 🧠 useMemo to build the features array from translations
  const features = useMemo(() => {
    const translatedFeatures = t('solutions', { returnObjects: true }) as Array<{
      title: string;
      description: string;
    }>;

    return translatedFeatures.map((item, index) => ({
      ...item,
      icon: iconMap[index],
    }));
  }, [t]);

  return (
    <>

      <Box flex="1" px={{ base: 6, md: 20 }} py={12} bg="solutionsBg"  minH='80vh'>
        <VStack spacing={6} align="center" textAlign="center" mb={10}>
          <Heading color="solutionsTextColor">{t('solutionsHeading')}</Heading>
          <Text maxW="2xl" fontSize="md" color={textColor} fontWeight='600'>
            {t('solutionsSubheading')}
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {features.map((feature, index) => (
            <Stack
              key={index}
              bg={cardBg}
              p={6}
              spacing={5}
              direction={{ base: 'column', md: 'row' }}
              borderRadius="md"
              border="1px solid"
              borderColor={borderColor}
              shadow="sm"
              align="center"
              _hover={{
                shadow: 'md',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Icon as={feature.icon} boxSize={12} color="solutionsTextColor" />
              <Box>
                <Heading size="sm" mb={1} color="solutionsTextColor" textAlign={{base: 'center', md: 'left'}}>
                  {feature.title}
                </Heading>
                <Text fontSize="sm" color={"solutionsSubTextColor"} textAlign={{base: 'center', md: 'left'}}>
                  {feature.description}
                </Text>
              </Box>
            </Stack>
          ))}
        </SimpleGrid>
      </Box>


    </>
  );
};

export default Solutions;

