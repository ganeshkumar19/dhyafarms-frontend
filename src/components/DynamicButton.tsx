import { Flex, Button } from '@chakra-ui/react';
import React from 'react';

interface DynamicButtonProps {
    primaryText: string;  
    secondaryText: string; 
    handlePrimaryAction: () => void;  
    handleSecondaryAction: () => void; 
}

const DynamicButton: React.FC<DynamicButtonProps> = ({ 
    primaryText, 
    secondaryText, 
    handlePrimaryAction, 
    handleSecondaryAction 
}) => {
  return (
    <Flex justify="space-between" align="center" width="100%" mt={2}>
        <Button
            bg="green.500" 
            color="white"
            py="10px"
            px={["10px", "30px", "50px"]}
            borderRadius="5px"
            _hover={{ bg: "green.600" }}
            onClick={handlePrimaryAction}
        >
            {primaryText}
        </Button>
        
        <Button
            bg="white"
            color="green.500"
            py="10px"
            px={["20px", "30px", "50px"]}
            border="1.5px solid"
            borderColor="green.500"
            borderRadius="5px"
            _hover={{ bg: "green.50" }}
            onClick={handleSecondaryAction}
        >
            {secondaryText}
        </Button>
    </Flex>
  );
};

export default DynamicButton;