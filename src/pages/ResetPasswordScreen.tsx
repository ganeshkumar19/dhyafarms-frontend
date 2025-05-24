import {
  Box,
  Input,
  FormControl,
  FormLabel,
  Heading,
  VStack,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicButton from '@/components/DynamicButton';
import AuthLayout from '@/layout/AuthLayout';

interface FormData {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formatLabel = (text: string) =>
    text.replace(/([A-Z])/g, ' $1').trim().replace(/^./, (char) => char.toUpperCase());

  const validateInput = (name: keyof FormData, value: string) => {
    let error = '';
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Please enter a valid email address';
    } else if (name === 'newPassword' && value.length < 6) {
      error = 'Password must be at least 6 characters';
    } else if (name === 'confirmPassword' && value !== formData.newPassword) {
      error = 'Passwords do not match';
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateInput(name as keyof FormData, value);
  };

  const handleSubmit = () => {
    if (!formData.email || !formData.newPassword || !formData.confirmPassword) {
      alert('Please fill out all fields');
      return;
    }

    if (Object.values(errors).some((error) => error)) {
      alert('Please fix the errors before submitting');
      return;
    }

    alert('✅ Password reset successfully!');
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  


  return (

      <AuthLayout>
      <Box bg="cardBg" p={8} borderRadius="lg" boxShadow="md" w={['95%', '480px']}>
        <Heading size="lg" textAlign="center" mb={4}>
          Reset Password
        </Heading>
        <VStack spacing={4}>
          {(['email', 'newPassword', 'confirmPassword'] as (keyof FormData)[]).map((key) => (
            <FormControl key={key} isRequired isInvalid={!!errors[key]}>
              <FormLabel>{formatLabel(key)}</FormLabel>
              <InputGroup>
                <Input
                  type={
                    key === 'newPassword'
                      ? showNewPassword
                        ? 'text'
                        : 'password'
                      : key === 'confirmPassword'
                      ? showConfirmPassword
                        ? 'text'
                        : 'password'
                      : 'text'
                  }
                  name={key}
                  placeholder={`Enter ${formatLabel(key)}`}
                  value={formData[key]}
                  onChange={handleChange}
                />
                {(key === 'newPassword' || key === 'confirmPassword') && (
                  <InputRightElement>
                    <IconButton
                      aria-label="Toggle Password"
                      size="sm"
                      icon={key === 'newPassword' ? (showNewPassword ? <ViewOffIcon /> : <ViewIcon />) : showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() =>
                        key === 'newPassword'
                          ? setShowNewPassword((s) => !s)
                          : setShowConfirmPassword((s) => !s)
                      }
                      variant="ghost"
                    />
                  </InputRightElement>
                )}
              </InputGroup>
              {errors[key] && (
                <Alert status="error" mt={2} borderRadius="md">
                  <AlertIcon />
                  {errors[key]}
                </Alert>
              )}
            </FormControl>
          ))}

          <DynamicButton
            primaryText="Reset Password"
            secondaryText="Cancel"
            handlePrimaryAction={handleSubmit}
            handleSecondaryAction={handleCancel}
          />
        </VStack>
      </Box>
    </AuthLayout>
  );
};

export default ResetPasswordPage;