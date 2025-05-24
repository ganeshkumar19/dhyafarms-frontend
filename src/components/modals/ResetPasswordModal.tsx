import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Button,
  Text,
  VStack,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useColorModeValue,
} from "@chakra-ui/react";

interface PasswordRequestModalProps {
  open: boolean;
  handleClose: () => void;
}

const PasswordRequestModal: React.FC<PasswordRequestModalProps> = ({ open, handleClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setMessage("Password reset link sent successfully!");
      toast({
        title: "Success",
        description: "Password reset link has been sent to your email.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }, 1500);
  };

  // ✅ Dark Mode Support
  const modalBg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("green.400", "green.300");
  const focusBorder = useColorModeValue("green.500", "green.400");

  return (
    <Modal isOpen={open} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent
        bg={modalBg}
        borderRadius="md"
        boxShadow="lg"
        maxW={{ base: "90%", sm: "400px" }}
      >
        <ModalHeader textAlign="center" fontSize="lg">
          Forgot Password
        </ModalHeader>
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <Text fontSize="sm" textAlign="center" color={textColor}>
              Enter your email address to receive a password reset link.
            </Text>

            <FormControl isInvalid={!!error}>
              <FormLabel fontSize="sm" color={textColor}>
                Email Address
              </FormLabel>
              <Input
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                bg={inputBg}
                borderColor={borderColor}
                focusBorderColor={focusBorder}
                color={textColor}
              />
              {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>

            <Button
              colorScheme="green"
              isFullWidth
              isLoading={loading}
              onClick={handleSubmit}
              disabled={!email || !validateEmail(email)}
              bg="green.600"
              color="white"
              _hover={{ bg: "green.700" }}
            >
              {loading ? "Sending..." : "Send Request"}
            </Button>

            {message && <Text fontSize="sm" color="green.500">{message}</Text>}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PasswordRequestModal;