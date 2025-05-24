import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  HStack,
  Alert,
  AlertIcon,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { register } from '@/api/auth';
import { useOnboardingStore } from '@/store/onBoardingStore';
import { useRegisterAuthStore } from '@/store/registerAuth';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { fetchLocation } from '@/api/location';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Text } from '@chakra-ui/react';
import { InputRightElement } from '@chakra-ui/react';
import { InputGroup } from '@chakra-ui/react';
import { handleChangeLanguage, languages } from '@/helpers/i18nHelpers';

interface FormField {
  label: string;
  placeholder: string;
  name: keyof FormData;
  type: string;
}

interface FormData {
  fullName: string;
  countryCode: string;
  mobile: string;
  email: string;
  password: string;
  language: string;
  location: string;
  lat: string;
  long: string
}

interface Errors {
  [key: string]: string | undefined;
}

interface StepOneFormProps {
  passedMobile?: string;
  passedCountryCode?: string;
}



const StepOneForm: React.FC<StepOneFormProps> = ({ passedMobile, passedCountryCode })=> {
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation('step1');
  const { login } = useAuthStore();

  useEffect(() => {
    if (passedMobile) {
      setForm({
        ...form,
        mobile: passedMobile,
        countryCode: passedCountryCode || '+91',
      });
      setMobileVerified(true);
    }
  }, [passedMobile, passedCountryCode]);




  const { setRegisterAuth } = useRegisterAuthStore();

  const form = useOnboardingStore((state) => state.form);
   const setForm = useOnboardingStore((state) => state.setForm);

  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [mobileVerified, setMobileVerified] = useState(false);
  const [isOtpWidgetLoaded, setIsOtpWidgetLoaded] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window.sendOtp === 'function' && typeof window.verifyOtp === 'function') {
        console.log('[OTP Widget] Ready');
        setIsOtpWidgetLoaded(true);
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);
  


  const formFields:FormField[] = useMemo(
    () => [
      {
        label: t('form.fullNameLabel'),
        placeholder: t('form.fullNamePlaceholder'),
        name: 'fullName',
        type: 'text',
      },
      {
        label: t('form.emailLabel'),
        placeholder: t('form.emailPlaceholder'),
        name: 'email',
        type: 'email',
      },
      {
        label: t('form.passwordLabel'),
        placeholder: t('form.passwordPlaceholder'),
        name: 'password',
        type: 'password',
      },
      {
        label: t('form.locationLabel'),
        placeholder: '',
        name: 'location',
        type: 'text',
      },
    ],
    [t]
  );

  const formatPhoneE164 = (code: string, mobile: string) => {
    return `${code}${mobile}`.replace(/\s+/g, '');
  };
  


  useEffect(() => {
    const getAndSetLocation = async () => {
      const locationData = await fetchLocation();
      if (locationData) {
        console.log(locationData)
        setForm(locationData);
      }
    };
  
    getAndSetLocation();
  }, []);
  

  useEffect(() => {
    const { fullName, mobile, email, password, location } = form;
    const isValid = !!(fullName && mobile && email && password && location);
    setIsFormValid(isValid);
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ [name as keyof FormData]: value });  // Casting name as keyof FormData
  };
  
  const validateInput = (name: keyof FormData, value: string): void => {
    let error = '';
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Please enter a valid email address';
    }
    if (name === 'mobile') {
      if (!/^\d{10}$/.test(value)) {
        error = 'Please enter a valid mobile number';
        setMobileVerified(false); // reset if invalid
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleVerifyMobile = () => {
    setError(null);
    if (!form.mobile || form.mobile.length !== 10) {
      setErrors((prev) => ({ ...prev, mobile: 'Please enter a valid mobile number' }));
      return;
    }
  
    if (!isOtpWidgetLoaded) {
      setError('OTP service still loading. Please wait...');
      return;
    }
  
    const mobileWithCode = formatPhoneE164(form.countryCode, form.mobile).replace('+', '');

    console.log('mobilewithcode', mobileWithCode);
    window.sendOtp?.(
      mobileWithCode,
      () => {
        toast({
          title: 'OTP sent!',
          description: 'Please check your phone.',
          status: 'info',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
        setOtpSent(true);
        setCooldown(30);
      },
      (err) => {
        console.error('[Send OTP Error]', err);
        setError('Failed to send OTP');
      }
    );
  };

  const handleVerifyOtp = () => {
    if (!otp || otp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }
  
    window.verifyOtp?.(
      otp,
      () => {
        setMobileVerified(true);
        toast({
          title: 'Mobile number verified!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
        setOtp('');
      },
      (err) => {
        console.error('[OTP Verification Failed]', err);
        setError('Invalid OTP');
      }
    );
  };
  
  const handleContinue = async () => {
    setError(null);
    setLoading(true);

    try {
      const data = await register({
        name: form.fullName,
        email: form.email,
        phone: `${form.countryCode}${form.mobile}`,
        password: form.password,
        language: form.language,
        location: form.location,
        lat: form.lat,
        long: form.long,
      });

      console.log('Registration successful:', data);




     await login({ token: data.token, user: data.user });
     setRegisterAuth(data.token, data.user, form);

      navigate('/get-started/step2');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';

      // If user already exists, show toast
      if (err.response?.status === 400 && msg === 'User already exists') {
        toast({
          title: t('form.userExistsTitle'),
          description: t('form.userExistsDesc'),
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form>
      <Stack spacing={4}>
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {formFields.map(({ label, placeholder, name, type }) => (
          <FormControl key={name} isRequired isInvalid={!!errors[name]}>
            <FormLabel>{label}</FormLabel>
            <Input
              name={name}
              type={type}
              value={form[name]}
              onChange={handleChange}
              onBlur={(e: any) => validateInput(name, e.target.value)}
              placeholder={placeholder}
              bg="bgInput"
              borderColor="stepBorderColor"
              focusBorderColor="green.400"
            />
            <FormErrorMessage>{errors[name]}</FormErrorMessage>
          </FormControl>
        ))}

<FormControl isRequired isInvalid={!!errors.mobile}>
  <FormLabel>{t('form.mobileLabel')}</FormLabel>
  <HStack align="flex-end">
    <Select
      name="countryCode"
      value={form.countryCode}
      onChange={handleChange}
      maxW="120px"
      bg="bgInput"
      borderColor="stepBorderColor"
      focusBorderColor="green.400"
      isDisabled={mobileVerified}
    >
      <option value="+91">🇮🇳 +91</option>
      <option value="+1">🇺🇸 +1</option>
      <option value="+44">🇬🇧 +44</option>
      <option value="+971">🇦🇪 +971</option>
    </Select>

    <InputGroup>
      <Input
        name="mobile"
        type="tel"
        value={form.mobile}
        onChange={(e: any) => {
          handleChange(e);
          if (mobileVerified) setMobileVerified(false); // reset verification on edit
        }}
        onBlur={(e: any) => validateInput('mobile', e.target.value)}
        placeholder={t('form.mobilePlaceholder') || 'Enter mobile number'}
        bg="bgInput"
        borderColor="stepBorderColor"
        focusBorderColor="green.400"
        isDisabled={mobileVerified}
        pr="4.5rem" // space for button
      />

      {form.mobile.length === 10 && !errors.mobile && !mobileVerified && (
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            size="sm"
            onClick={handleVerifyMobile}
            colorScheme="blue"
          >
            Verify
          </Button>
        </InputRightElement>
      )}

      {mobileVerified && (
        <InputRightElement width="4.5rem">
          <Text fontSize="sm" color="green.500" mt="1">
            ✓
          </Text>
        </InputRightElement>
      )}
        </InputGroup>
      </HStack>

      <FormErrorMessage>{errors.mobile}</FormErrorMessage>
    </FormControl>

    {otpSent && !mobileVerified && (
      <FormControl mt={2} isRequired isInvalid={!!error}>
        <FormLabel>Enter OTP</FormLabel>
        <InputGroup>
          <Input
            type="text"
            value={otp}
            onChange={(e: any) => setOtp(e.target.value)}
            maxLength={4}
            placeholder="Enter OTP"
            bg="bgInput"
            borderColor="stepBorderColor"
            focusBorderColor="green.400"
          />

        <InputRightElement width="5.5rem">
          <Button
            h="1.75rem"
            size="xs"
            onClick={handleVerifyOtp}
            colorScheme="blue"
          >
            Verify OTP
          </Button>
        </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    )}

        <FormControl isRequired>
          <FormLabel>{t('form.languageLabel')}</FormLabel>
          <Select
            name="language"
            value={form.language}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
              handleChange(e);
              handleChangeLanguage(e.target.value); // <- sync i18n language
            }}
            bg="bgInput"
            borderColor="stepBorderColor"
            focusBorderColor="green.400"
          >
            {languages.map(({ code, label }) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </Select>

        </FormControl>


        <Stack direction={{ base: 'column', sm: 'row' }} justify="space-between" mt={4}>
          <Button variant="ghost" onClick={() => navigate('/login')} size="sm">
            {t('form.loginRedirect')}
          </Button>
          <Button
            colorScheme="green"
            size="sm"
            onClick={handleContinue}
            isDisabled={!isFormValid || loading}
            isLoading={loading}
          >
            {t('form.continueButton')}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default StepOneForm;
