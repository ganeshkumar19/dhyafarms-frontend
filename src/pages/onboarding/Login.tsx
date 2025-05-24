import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Input, Text, VStack, Heading, Link, FormControl, FormLabel,
  Alert, AlertIcon, useDisclosure, Flex, InputGroup, InputRightElement, HStack, useToast
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useColorModeValue } from '@/components/ui/color-mode';
import { loginWithPassword, loginWithOtp } from '@/api/auth';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useTranslation } from 'react-i18next';
import PasswordRequestModal from '@/components/modals/ResetPasswordModal';
import aquaBg from '@/assets/images/aquaintellilanding.jpg';
import DHYAICON from '@/assets/images/bigfaviconwhite.png';
import { Image } from '@chakra-ui/react';
import { Select } from '@chakra-ui/react';

// 👇 Extend window to support sendOtp and verifyOtp
declare global {
  interface Window {
    sendOtp: (identifier: string, success?: (data: any) => void, failure?: (error: any) => void) => void;
    verifyOtp: (otp: string, success?: (data: any) => void, failure?: (error: any) => void, reqId?: string) => void;
  }
}

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation('login');

  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isOtpWidgetLoaded, setIsOtpWidgetLoaded] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');

  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    if (!email.trim()) {
      setError('Phone or Email is required');
      return;
    }
  
    if (loginMethod === 'password' && !password) {
      setError('Password is required');
      return;
    }
  
    setLoading(true);
    try {
      const data = await loginWithPassword(email, password); 
      console.log(data)// ✅ updated
      await useAuthStore.getState().login(data);
      toast({ title: 'Login successful', status: 'success', duration: 3000 });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setError('');
    if (!email.trim()) {
      setError('Phone number is required');
      return;
    }
    if (!isOtpWidgetLoaded) {
      setError('OTP service still loading. Please wait...');
      return;
    }

    try {
      const mobileWithCountry = `${countryCode.replace('+', '')}${email.trim()}`;
      console.log('[OTP] Sending OTP to:', mobileWithCountry);

      window.sendOtp?.(
        mobileWithCountry,
        (data) => {
          console.log('[OTP Sent]', data);
          setOtpSent(true);
          setCooldown(30);
          toast({ title: 'OTP sent successfully', status: 'success', duration: 3000 });
        },
        (error) => {
          console.error('[OTP Send Error]', error);
          setError('Failed to send OTP');
        }
      );
    } catch (error) {
      console.error('[Send OTP Exception]', error);
      setError('Failed to send OTP');
    }
  };

  const handleOtpVerifyAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('OTP is required');
      return;
    }
  
    try {
      console.log('[OTP Verifying]', otp);
  
      window.verifyOtp?.(
  otp,
  async (data: any) => {
    console.log('[OTP Verified]', data);

    try {
      const loginData = await loginWithOtp(email, data?.message || 'verified');
      console.log('logindata', loginData);

      await useAuthStore.getState().login(loginData);

      if (loginData?.user?.status === 'INCOMPLETE') {
        toast({
          title: 'Complete your registration',
          status: 'info',
          duration: 3000,
        });
        navigate('/get-started/step1', {
          state: {
            mobile: email.trim(),
            countryCode: countryCode,
          },
        });
      } else {
        toast({ title: 'Login successful', status: 'success', duration: 3000 });
        navigate('/dashboard');
      }
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 401) {
        toast({
          title: 'User not registered',
          description: 'Please sign up first.',
          status: 'warning',
          duration: 4000,
          isClosable: true,
          position: 'top',
        });
        navigate('/get-started/step1', {
          state: {
            mobile: email.trim(),
            countryCode: countryCode,
          },
        });
      } else {
        console.error('[Login with OTP Error]', err);
        setError('Login failed. Please try again.');
      }
    }
  },
  (error: any) => {
    console.error('[OTP Verification Error]', error);
    setError('Invalid OTP');
  }
);

    } catch (error) {
      console.error('[OTP Verify Exception]', error);
      setError('OTP verification failed');
    }
  };

  const bgGradient = useColorModeValue('linear(to-br, green.50, blue.50)', 'linear(to-br, gray.800, gray.900)');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const overlayColor = useColorModeValue('rgba(0,0,0,0.6)', 'rgba(0,0,0,0.6)');

  return (
    <Box minH="100vh" bgGradient={bgGradient} display="flex" flexDirection="column">
      <Box
        position="relative"
        flex="1"
        bgImage={`url(${aquaBg})`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        display="flex"

        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        px={{ base: 4, md: 20 }}
        pt={{ base: 8, md: 12 }}
        pb={{ base: 16, md: 18 }}
      >
        <Box position="absolute" inset={0} bg={overlayColor} zIndex={0} />
        <Flex flex="1" direction="column" align="center" justify="center" px={4} py={12} zIndex={1} position="relative">
          <Image src={DHYAICON} alt="Dhya" position="absolute" top={-12} left="50%" transform="translateX(-50%)" boxSize={{ base: '180px' }} objectFit="contain" zIndex={0} opacity={1} />
          <Box maxW="md" w="full" bg={cardBg} boxShadow="lg" borderRadius="lg" p={8}>
            <VStack spacing={6} align="stretch">
              <Box textAlign="center">
                <Heading fontSize="lg" mt={5} mb={2}>{t('greeting')}</Heading>
                <Text fontSize="sm" color={textColor}>{t('greetingDesc')}</Text>
              </Box>

              <HStack justify="center" spacing={4}>
                <Button variant={loginMethod === 'password' ? 'solid' : 'ghost'} colorScheme="green" size="sm" onClick={() => { setLoginMethod('password'); setOtp(''); setOtpSent(false); setError(''); }}>
                  Password
                </Button>
                <Button variant={loginMethod === 'otp' ? 'solid' : 'ghost'} colorScheme="green" size="sm" onClick={() => { setLoginMethod('otp'); setPassword(''); setError(''); }}>
                  OTP
                </Button>
              </HStack>

              {error && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              <form onSubmit={loginMethod === 'otp' ? handleOtpVerifyAndLogin : handleSubmit}>
                <VStack spacing={4}>
                <FormControl isRequired>
  <FormLabel>
    {loginMethod === 'otp' ? 'Phone Number' : 'Email'}
  </FormLabel>

  {loginMethod === 'otp' ? (
    <HStack spacing={2} align="flex-end">
      <Box flex="0 0 30%">
        <Select
          value={countryCode}
          onChange={(e: any) => setCountryCode(e.target.value)}
          borderColor="green.400"
          focusBorderColor="green.500"
        >
          <option value="+91">🇮🇳 +91</option>
          <option value="+1">🇺🇸 +1</option>
          <option value="+44">🇬🇧 +44</option>
          <option value="+971">🇦🇪 +971</option>
        </Select>
      </Box>
      <Box flex="1">
        <Input
          name="phone"
          type="text"
          placeholder="Enter phone number"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          borderColor="green.400"
          focusBorderColor="green.500"
        />
      </Box>
    </HStack>
  ) : (
    <Input
      name="email"
      type="email"
      placeholder="Enter email address"
      value={email}
      onChange={(e: any) => setEmail(e.target.value)}
      borderColor="green.400"
      focusBorderColor="green.500"
    />
  )}
</FormControl>


                  {loginMethod === 'password' && (
                    <FormControl isRequired>
                      <FormLabel>{t('password')}</FormLabel>
                      <InputGroup>
                        <Input
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter password"
                          value={password}
                          onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
                          borderColor="green.400"
                          focusBorderColor="green.500"
                        />
                        <InputRightElement h="full">
                          <Button variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                            {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  )}
                  {loginMethod === 'otp' && (
                    <>
                      <FormControl isRequired>
                        <FormLabel>OTP</FormLabel>
                        <Input
                          name="otp"
                          type="text"
                          placeholder="Enter received OTP"
                          value={otp}
                          onChange={(e: any) => setOtp(e.target.value)}
                          borderColor="green.400"
                          focusBorderColor="green.500"
                        />
                      </FormControl>

                      <Button
                        onClick={handleSendOtp}
                        size="sm"
                        variant="outline"
                        colorScheme="green"
                        isDisabled={cooldown > 0}
                      >
                        {cooldown > 0 ? `Resend OTP in ${cooldown}s` : (otpSent ? 'Resend OTP' : 'Send OTP')}
                      </Button>
                    </>
                  )}



                  {loginMethod === 'password' && (
                    <Box w="full" textAlign="right">
                      <Link color="green.600" fontSize="sm" onClick={onOpen}>
                        {t('forgetPassword')}
                      </Link>
                    </Box>
                  )}

                  <Button type="submit" colorScheme="green" w="full" isLoading={loading}>
                    {t('login')}
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Box>
        </Flex>
      </Box>
      <PasswordRequestModal open={isOpen} handleClose={onClose} />
    </Box>
  );
};

export default Login;