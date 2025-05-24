import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text } from '@chakra-ui/react';

interface SubmitRequestModalProps {
  open: boolean;
  handleClose: () => void;
}


const SubmitRequestModal: React.FC<SubmitRequestModalProps> = ({ open, handleClose }) => {

  return (
    <Modal isOpen={open} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent 
        w={['300px', '350px']} 
        bg="cardBg"
        boxShadow="xl" 
        borderRadius="30px" 
        textAlign="center" 
        p={3}
      >
        <ModalHeader fontSize="lg" fontWeight="bold" color="textColor">
          Your Request has been Processed Successfully.
        </ModalHeader>
        
        <ModalBody>
          <Text color="textColor">You will be intimated soon.</Text>
        </ModalBody>
        
        <ModalFooter display="flex" justifyContent="center">
          <Button bg="green.500" color="white" _hover={{ bg: "green.600" }} onClick={handleClose}>
            Back
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SubmitRequestModal;
