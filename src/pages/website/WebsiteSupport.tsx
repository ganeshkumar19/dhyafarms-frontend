import { InputRightElement } from '@chakra-ui/react';
import { InputGroup } from '@chakra-ui/react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
    VStack,
    Heading,
    useToast,
  } from '@chakra-ui/react';
  import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
  
  const WebsiteSupport = () => {
    const toast = useToast();
    const { t } = useTranslation('websupport');
  
    const [issue, setIssue] = useState('');
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [severity, setSeverity] = useState('low');

    const severityOptions = useMemo(() => [
        { value: 'low', label: t('severity.low') },
        { value: 'medium', label: t('severity.medium') },
        { value: 'high', label: t('severity.high') },
      ], [t]);
  
    // For now we hardcode or leave deviceId empty
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
  
      // Later: add validation or API logic here
      toast({
        title: 'Support Request Submitted',
        description: 'Our team will get back to you shortly.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
  
      // Clear form
      setIssue('');
      setScreenshot(null);
      setSeverity('low');
    };
  
    return (
        <Box flex="1" px={{ base: 6, md: 20 }} py={12} bg="solutionsBg" minH='80vh'>
      <Box maxW="2xl" mx="auto" mt={10} p={6} bg="cardBg" boxShadow="md" borderRadius="lg">
        <Heading size="lg" mb={6} textAlign="center">
        {t('title')}
        </Heading>
  
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            {/* Device ID (hidden or readonly if not available yet) */}
  
            {/* Issue Description */}
            <FormControl isRequired>
              <FormLabel>{t('descriptionLabel')}</FormLabel>
              <Textarea
                value={issue}
                onChange={(e: any) => setIssue(e.target.value)}
                placeholder={t('descriptionPlaceholder')}
                rows={4}
              />
            </FormControl>
  
            {/* Screenshot Upload */}
            <FormControl>
  <FormLabel>{t('screenshotLabel')}</FormLabel>
  <InputGroup>
    <Input
      placeholder={screenshot?.name || t('screenshotPlaceholder')}
      isReadOnly
      cursor="pointer"
    />
    <InputRightElement width="7rem">
      <Button
        h="1.75rem"
        size="sm"
        onClick={() => document.getElementById('file-upload')?.click()}
        colorScheme="blue"
      >
        {t('chooseFile')}
      </Button>
    </InputRightElement>
  </InputGroup>
  <Input
    id="file-upload"
    type="file"
    accept="image/*"
    display="none"
    onChange={(e: any) => setScreenshot(e.target.files?.[0] || null)}
  />
</FormControl>
  
            {/* Severity Dropdown */}
            <FormControl isRequired>
              <FormLabel>{t('severityLabel')}</FormLabel>
              <Select value={severity} onChange={(e:any) => setSeverity(e.target.value)}>
                {severityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </FormControl>
  
            <Button type="submit" colorScheme="blue" width="full">
            {t('submitButton')}
            </Button>
          </VStack>
        </form>
      </Box>
      </Box>
    );
  };
  
  export default WebsiteSupport;