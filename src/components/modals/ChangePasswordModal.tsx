import { changeUserPassword } from '@/api/settings';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    Stack,
  } from '@chakra-ui/react';
  import { useState } from 'react';

  type FieldKey = 'oldPassword' | 'newPassword' | 'retypePassword';

interface FormData {
  oldPassword: string;
  newPassword: string;
  retypePassword: string;
}

  interface CreatePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  const ChangePasswordModal: React.FC<CreatePasswordModalProps>  = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<FormData>({
      oldPassword: '',
      newPassword: '',
      retypePassword: '',
    });
  
    const toast = useToast();
  
    const handleChange = (field: FieldKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      };
      const handleSubmit = async () => {
        const { oldPassword, newPassword, retypePassword } = formData;
      
        if (newPassword !== retypePassword) {
          toast({
            title: 'Passwords do not match',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        if (oldPassword === newPassword) {
            toast({
              title: 'New password cannot be the same as the old password',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
            return;
        }
        
      
        try {
          await changeUserPassword(oldPassword, newPassword);
      
          toast({
            title: 'Password changed successfully!',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
      
          setFormData({ oldPassword: '', newPassword: '', retypePassword: '' });
          onClose();
        } catch (error: any) {
          const message = error?.response?.data?.message || 'Failed to change password';
          toast({
            title: 'Error',
            description: message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      };
      
  
    const fields: Array<{ label: string; key: FieldKey }> = [
        { label: 'Old Password', key: 'oldPassword' },
        { label: 'New Password', key: 'newPassword' },
        { label: 'Retype New Password', key: 'retypePassword' },
      ];
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              {fields.map(({ label, key }) => (
                <FormControl key={key}>
                  <FormLabel>{label}</FormLabel>
                  <Input
                    type="password"
                    value={formData[key]}
                    onChange={handleChange(key)}
                  />
                </FormControl>
              ))}
            </Stack>
          </ModalBody>
          <ModalFooter>
          <Button
                onClick={onClose}
                mr={3}
                bg="transparent"
                border="1px solid"
                borderColor="blue.500"
                color="blue.500"
                >
                Cancel
                </Button>
      
            <Button colorScheme="blue" onClick={handleSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default ChangePasswordModal;
  