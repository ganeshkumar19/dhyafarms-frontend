import React, { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import DynamicButton from '@/components/DynamicButton';
import SubmitRequestModal from '@/modals/SubmitRequestModal';
import AuthLayout from '@/layout/AuthLayout';

interface FormField {
  label: string;
  type: string;
  name: keyof FormData;
  placeholder: string;
}

interface FormData {
  username: string;
  email: string;
  mobileno: string;
  address: string;
}

interface Errors {
  email?: string;
  mobileno?: string;
  username?: string;
  address?: string;
}

const RegisterPage = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    mobileno: '',
    address: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);


  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateInput(name as keyof FormData, value);
  };

  const validateInput = (name: keyof FormData, value: string): void => {
    let error = '';
    switch (name) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid Email Address';
        }
        break;
      case 'mobileno':
        if (!/^\d{10}$/.test(value)) {
          error = 'Please enter a valid Mobile Number';
        }
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = (): void => {
    console.log('Form submitted:', formData);
    setIsModalOpen(true);
  };

  const handleCancel = (): void => {
    navigate('/');
  };

  const formFields: FormField[] = [
    { label: 'Username', name: 'username', type: 'text', placeholder: 'Enter your username' },
    { label: 'Email', name: 'email', type: 'email', placeholder: 'Enter your Email' },
    { label: 'Mobile', name: 'mobileno', type: 'text', placeholder: 'Enter your Mobile number' },
    { label: 'Address', name: 'address', type: 'text', placeholder: 'Enter your Address' },
  ];

  return (
    <AuthLayout>
      <Box
        maxW="md"
        w="full"
        h={['440px', '450px', '500px', '550px']}
        bg="cardBg"
        boxShadow="lg"
        borderRadius="lg"
        p={5}
        display="flex"
        flexDirection="column"
      >
        {/* Make the form scrollable */}
        <Box 
          as="form" 
          p={2} 
          borderRadius="md" 
          flex="1" 
          overflowY="auto"
          sx={{
            /* Scrollbar width */
            '&::-webkit-scrollbar': {
              width: '3px', 
            },
            /* Scrollbar track (background) */
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            /* Scrollbar thumb (the moving part) */
            '&::-webkit-scrollbar-thumb': {
              background: 'green.600',
              borderRadius: '10px',
            },
            /* Scrollbar thumb on hover */
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'green.500',
            },
          }}
        
        >
          <Text fontSize="xl" fontWeight="bold" textAlign="center" mb={4} color="textColor">
            Register
          </Text>

          <VStack spacing={3}>
            {formFields.map((field) => (
              <FormControl key={field.name} isRequired>
                <FormLabel fontSize="md" fontWeight="bold">
                  {field.label}
                </FormLabel>
                {field.name === 'address' ? (
                  <Textarea
                    placeholder={field.placeholder}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    resize="none"
                    rows={3}
                    border="1px solid"
                    borderColor="green.400"
                    focusBorderColor="green.500"
                    color="inputTextColor"
                    _placeholder={{ color: "placeholderColor" }}
                  />
                ) : (
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    border="1px solid"
                    borderColor="green.400"
                    color="inputTextColor"
                    _placeholder={{ color: "placeholderColor" }}
                    focusBorderColor="green.500"
                  />
                )}
                {errors[field.name] && (
                  <Text color="red.500" fontSize="sm">
                    {errors[field.name]}
                  </Text>
                )}
              </FormControl>
            ))}

           <DynamicButton
              primaryText="Submit"
              secondaryText="Cancel"
              handlePrimaryAction={handleSubmit}
              handleSecondaryAction={handleCancel}
            />
          </VStack>
        </Box>
      </Box>
      <SubmitRequestModal open={isModalOpen} handleClose={() => setIsModalOpen(false)} />
    </AuthLayout>
  );
};

export default RegisterPage;

