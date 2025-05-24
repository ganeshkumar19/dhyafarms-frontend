import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    FormControl,
    FormLabel,
    VStack,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  
  
  interface EditPondModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentName: string;
    onSubmit: (newName: string) => void;
  }
  
  const EditPondModal = ({ isOpen, onClose, currentName, onSubmit }: EditPondModalProps) => {
    const [name, setName] = useState(currentName);

  
    const handleSubmit = () => {
      onSubmit(name);
      onClose();
    };
  
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="xl" p={2}>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel fontWeight="medium" color="gray.600">
                  Full Name
                </FormLabel>
                <Input
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                  placeholder="Enter your name"
                  focusBorderColor="green.500"
                  size="md"
                  borderRadius="md"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} variant="ghost" mr={3}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleSubmit}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default EditPondModal;