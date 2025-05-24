import React, { useEffect, useRef, useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, FormLabel, Input, Button,
  Stack, Select, HStack, useToast, 
} from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { changeUserPhone } from '@/api/settings';

interface ChangeMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangeMobileModal: React.FC<ChangeMobileModalProps> = ({ isOpen, onClose }) => {
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isOtpWidgetLoaded, setIsOtpWidgetLoaded] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState('');
  const toast = useToast();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load OTP widget check
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

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSendOtp = async () => {
    setError('');
    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }
    if (!isOtpWidgetLoaded) {
      setError('OTP service still loading. Please wait...');
      return;
    }

    try {
      const fullPhone = `${countryCode.replace('+', '')}${phone.trim()}`;
      console.log('[OTP] Sending OTP to:', fullPhone);

      window.sendOtp?.(
        fullPhone,
        (data: any) => {
          console.log('[OTP Sent]', data);
          setOtpSent(true);
          setCooldown(30);
          toast({ title: 'OTP sent successfully', status: 'success', duration: 3000 });
        },
        (err: any) => {
          console.error('[OTP Error]', err);
          setError('Failed to send OTP');
        }
      );
    } catch (err) {
      console.error('[Send OTP Exception]', err);
      setError('Failed to send OTP');
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Keep only last digit
    setOtp(newOtp);
  
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  // Handle key press for backspace to go to previous box
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      setError('Enter complete 4-digit OTP');
      return;
    }
  
    window.verifyOtp?.(
      enteredOtp,
      async (data: any) => {
        console.log('[OTP Verified]', data);
  
        try {
            const fullPhone = `${countryCode}${phone.trim()}`;
            await changeUserPhone(fullPhone);
  
          toast({
            title: 'Mobile number updated',
            status: 'success',
            duration: 3000,
          });
  
          // Reset state after success
          setOtp(['', '', '', '']);
          setOtpSent(false);
          setPhone('');
          onClose();
        } catch (err: any) {
          console.error('[Phone Update Error]', err);
          setError('Failed to update mobile number');
        }
      },
      (err: any) => {
        console.error('[Verify OTP Error]', err);
        setError('Invalid OTP');
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change Mobile Number</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <HStack>
              <Select
                value={countryCode}
                onChange={(e: any) => setCountryCode(e.target.value)}
                borderColor="green.400"
                focusBorderColor="green.500"
                maxW="25%"
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+971">🇦🇪 +971</option>
              </Select>
              <Input
                placeholder="Mobile Number"
                value={phone}
                onChange={(e: any) => setPhone(e.target.value)}
              />
            </HStack>

            {!otpSent && (
              <Button
                onClick={handleSendOtp}
                isDisabled={cooldown > 0}
                colorScheme="blue"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Get OTP'}
              </Button>
            )}

            {otpSent && (
              <>
                <FormLabel>Enter OTP</FormLabel>
                <HStack>
                {otp.map((digit, idx) => (
                    <Input
                    key={idx}
                    ref={(el: any) => (inputRefs.current[idx] = el)}
                    type="tel"
                    maxLength={1}
                    value={digit}
                    onChange={(e: any) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e: any) => handleKeyDown(e, idx)}
                    textAlign="center"
                    width="3rem"
                    />
                ))}
                </HStack>
                <Button colorScheme="green" onClick={handleVerifyOtp}>
                  Verify OTP
                </Button>
              </>
            )}

            {error && <Box color="red.500" fontSize="sm">{error}</Box>}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3} bg="transparent" border="1px solid" borderColor="blue.500" color="blue.500">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangeMobileModal;
