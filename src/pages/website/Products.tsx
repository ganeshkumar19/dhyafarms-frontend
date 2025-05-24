import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    Stack,
    Button,
    Icon,
    Flex,
  } from '@chakra-ui/react';
  import {
    FaTachometerAlt,
    FaMicrochip,
    FaSatelliteDish,
    FaRegChartBar,
  } from 'react-icons/fa';
  import { useNavigate } from 'react-router-dom';
  import { SimpleGrid } from '@chakra-ui/react';
  import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
  
  
const Products = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('products');

  const products = useMemo(() => {
    const data = t('products', { returnObjects: true }) as Record<
      string,
      { name: string; description: string; cta: string }
    >;

    const icons = [FaTachometerAlt, FaMicrochip, FaSatelliteDish, FaRegChartBar];
    const paths = ['/dashboard', '/products/fishsense', '/solutions', '/trends'];

    return Object.values(data).map((item, index) => ({
      title: item.name,
      description: item.description,
      cta: item.cta,
      icon: icons[index],
      path: paths[index],
    }));
  }, [t]);



  
    return (
      <>
        <Box flex="1" px={{ base: 6, md: 20 }} py={12} bg="solutionsBg"  minH='80vh'>
          <VStack spacing={6} align="center" textAlign="center" mb={10}>
            <Heading color="solutionsTextColor">{t('title')}</Heading>
            <Text maxW="2xl" fontSize="md" color="solutionsSubTextColor">
            {t('subtitle')}
            </Text>
          </VStack>
  
          <Stack spacing={6}>
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6}>
              {products.map((product, index) => (
                <Flex
                  key={index}
                  direction="column"
                  justify="space-between"
                  p={3}
                  py={4}
                  bg="cardBg"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="borderColor"
                  shadow="sm"
                  _hover={{
                    shadow: 'md',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease',
                  }}
                  gap={6}
                >
                  <HStack align="flex-start" gap={5}>
                    <Icon as={product.icon} boxSize={12} color="solutionsTextColor" />
                    <Box>
                      <Heading size="sm" mb={1} color="solutionsTextColor">
                        {product.title}
                      </Heading>
                      <Text fontSize="sm" color="solutionsSubTextColor">
                        {product.description}
                      </Text>
                    </Box>
                  </HStack>

                  <Button
                    size="sm"
                    backgroundColor='solutionsTextColor'
                    textColor='white'
                    variant="solid"
                    onClick={() => navigate(product.path)}
                    alignSelf="center"
                  >
                    {product.cta}
                  </Button>
                </Flex>
              ))}
            </SimpleGrid>
          </Stack>
        </Box>
  
        </>
    );
  };
  
  export default Products;