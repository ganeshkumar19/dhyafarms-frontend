import React, { useState } from 'react';
import {
 Button, FormControl, FormLabel, Select, Textarea, VStack, useToast, Input, InputGroup, InputRightElement, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { getFarms } from '@/api/farm';
import { getPondsByFarmId } from '@/api/pond';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createSupportTicket } from '@/api/support';

interface Device {
  id: string;
  deviceId: string;
  type: string;
  status: string;
}

interface Pond {
  id: string;
  name: string;
  devices?: Device[];
}

interface Farm {
  id: string;
  name: string;
}

interface CreateSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateSupportModal: React.FC<CreateSupportModalProps> = ({ isOpen, onClose }) => {
  const [selectedFarm, setSelectedFarm] = useState('');
  const [selectedPond, setSelectedPond] = useState('');
  const [issue, setIssue] = useState('');
  const [location, setLocation] = useState('');
  const [ponds, setPonds] = useState<Pond[]>([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { t } = useTranslation('support');
  const toast = useToast();

  const { data: farms, isLoading: farmsLoading } = useQuery({
    queryKey: ['farms'],
    queryFn: getFarms,
  });

  const handleFarmChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const farmId = e.target.value;
    setSelectedFarm(farmId);
    setSelectedPond('');
    setPonds([]);
    if (farmId) {
      try {
        const fetchedPonds = await getPondsByFarmId(farmId);
        setPonds(fetchedPonds);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch ponds.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedFarm || !selectedPond || !issue.trim()) {
      toast({
        title: 'Missing Fields',
        description: 'Please complete all required fields before submitting.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const ticketData = {
      issue,
      farmId: selectedFarm,
      pondId: selectedPond,
      ...(selectedDevice && { deviceId: selectedDevice }),
      ...(screenshot && { screenshotUrl: '' }), // Add actual upload handling later
    };

    try {
      await createSupportTicket(ticketData);
      toast({
        title: 'Support Request Sent',
        description: 'We have received your issue.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      queryClient.invalidateQueries({ queryKey: ['supportTickets'] });

      // Reset
      setSelectedFarm('');
      setSelectedPond('');
      setIssue('');
      setLocation('');
      setScreenshot(null);
      setSelectedDevice('');
      setPonds([]);
      onClose();
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Unable to submit support request.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const selectedPondObj = ponds.find((pond) => pond.id === selectedPond);
  const pondDevices = selectedPondObj?.devices ?? [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxH="60vh" overflowY="auto">
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>{t('selectFarm')}</FormLabel>
              <Select
                placeholder={t('farmPlaceholder')}
                value={selectedFarm}
                onChange={handleFarmChange}
                isDisabled={farmsLoading}
              >
                {farms?.map((farm: Farm) => (
                  <option key={farm.id} value={farm.id}>
                    {farm.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired isDisabled={!selectedFarm}>
              <FormLabel>{t('selectPond')}</FormLabel>
              <Select
                placeholder={t('pondPlaceholder')}
                value={selectedPond}
                onChange={(e: any) => setSelectedPond(e.target.value)}
              >
                {ponds.map((pond) => (
                  <option key={pond.id} value={pond.id}>
                    {pond.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isDisabled={!selectedPond || pondDevices.length === 0}>
              <FormLabel>{t('deviceType')}</FormLabel>
              <Select
                placeholder={pondDevices.length === 0 ? 'No devices linked' : 'Select a device'}
                value={selectedDevice}
                onChange={(e: any) => setSelectedDevice(e.target.value)}
                isDisabled={pondDevices.length === 0}
              >
                {pondDevices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.deviceId} ({device.type})
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>{t('screenshotLabel')}</FormLabel>
              <InputGroup>
                <Input
                  placeholder={screenshot?.name || t('screenshotPlaceholder')}
                  isReadOnly
                  cursor="pointer"
                />
                <InputRightElement width="7rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    {t('chooseFile')}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                display="none"
                onChange={(e: any) => setScreenshot(e.target.files?.[0] || null)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>{t('location')}</FormLabel>
              <Input
                value={location}
                onChange={(e: any) => setLocation(e.target.value)}
                placeholder={t('locationPlaceholder')}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{t('describeIssue')}</FormLabel>
              <Textarea
                value={issue}
                onChange={(e: any) => setIssue(e.target.value)}
                placeholder={t('issuePlaceholder')}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" onClick={handleSubmit} w="100%">
            {t('submitBtn')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateSupportModal;
