import { Box, HStack, Text} from '@chakra-ui/react';

interface StepProgressBarProps {
  step: number; 
  total: number;
}

const StepProgressBar = ({ step, total }: StepProgressBarProps) => {
  const progressPercent = (step / total) * 100;

  return (
    <HStack spacing={4} align="center" mb={4}>
      <Text fontSize="sm" fontWeight="medium" color="textColor">
        Step {step} of {total}
      </Text>
      <Box
        flex="1"
        h="6px"
        bg="bgTrack"
        borderRadius="full"
        overflow="hidden"
      >
        <Box
          w={`${progressPercent}%`}
          h="100%"
          bg="filledColor"
          transition="width 0.4s ease-in-out"
        />
      </Box>
    </HStack>
  );
};

export default StepProgressBar;