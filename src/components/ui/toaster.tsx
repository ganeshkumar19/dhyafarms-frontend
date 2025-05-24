// src/components/ui/toaster.tsx
import { useToast } from '@chakra-ui/react';

export const Toaster = () => {
  const toast = useToast();

  const create = ({ title, description }: { title: string; description: string }) => {
    toast({
      title: title,
      description: description,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return { create };
};