import { useState, useMemo } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const Faq = () => {
  const { t } = useTranslation('faq');
  const [userQuestion, setUserQuestion] = useState('');
  const toast = useToast();

  const faqData = useMemo(() => {
    return t('questions', { returnObjects: true }) as { question: string; answer: string }[];
  }, [t]);

  const handleQuestionSubmit = () => {
    if (!userQuestion.trim()) {
      toast({
        title: t('toastEmpty'),
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: t('toastSuccessTitle'),
      description: t('toastSuccessDesc'),
      status: 'success',
      duration: 4000,
      isClosable: true,
    });

    setUserQuestion('');
  };

  return (
    <Box flex="1" px={{ base: 6, md: 20 }} py={12} bg="solutionsBg">
      <Box maxW="4xl" mx="auto" mt={6} p={6} bg="cardBg" borderRadius="lg" shadow="md">
        <Heading size="lg" mb={6} textAlign="center" color="headingColor">
          {t('title')}
        </Heading>

        <Accordion allowToggle>
          {faqData.map((item, index) => (
            <AccordionItem key={index}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left" fontWeight="semibold" fontSize={{base: 'sm', md: 'md' }}>
                    {item.question}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} color="textColor" fontSize={{base: 'sm', md: 'md' }}>
                {item.answer}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

        <Box mt={10}>
          <VStack spacing={4} align="stretch">
            <Text fontWeight="semibold" fontSize="lg" color="headingColor">
              {t('submitTitle')}
            </Text>
            <Input
              placeholder={t('placeholder')}
              color="inputBg"
              value={userQuestion}
              onChange={(e: any) => setUserQuestion(e.target.value)}
              bg="bgInput"
            />
            <Button colorScheme="blue" w="fit-content" onClick={handleQuestionSubmit}>
              {t('submitButton')}
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Faq;
