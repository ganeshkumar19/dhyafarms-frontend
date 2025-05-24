import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  Select,
  RadioGroup,
  Radio,
  HStack,
  Stack,
  Tag,
  TagLabel,
  TagCloseButton,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query'; // replace with actual API
import { useTranslation } from 'react-i18next';
import { createPond, GetPondSizes, GetPondSpecies } from '@/api/pond';
import { usePondFormStore } from '@/store/pondFarmStore';

 interface AddPondModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmId: string;
}

const AddPondModal: React.FC<AddPondModalProps> = ({ isOpen, onClose, farmId }) => {
  const { t } = useTranslation('step3');
  const queryClient = useQueryClient();

  const toast = useToast();
  const {
    pondName,
    pondSize,
    stockingDensity,
    species,
    monitoring,
    deviceIds,
    setField,
    addDevice,
    removeDevice,
    resetForm,
  } = usePondFormStore();

  const [deviceInput, setDeviceInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setField(name as any, value);
  };

  const handleAddDevice = () => {
    if (!deviceInput.trim()) return;
    addDevice(deviceInput.trim());
    setDeviceInput('');
  };

  const handleRemoveDevice = (id: string) => {
    removeDevice(id);
  };

  const formFields = [
    {
      name: 'pondName',
      label: t('form.pondName'),
      placeholder: t('form.pondNamePlaceholder'),
      required: true,
      type: 'input',
    },
    {
      name: 'pondSize',
      label: t('form.pondSize'),
      placeholder: t('form.pondSizePlaceholder'),
      required: true,
      type: 'select',
    },
    {
      name: 'stockingDensity',
      label: t('form.stockingDensity'),
      placeholder: t('form.stockingDensityPlaceholder'),
      type: 'input',
    },
    {
      name: 'species',
      label: t('form.species'),
      placeholder: t('form.speciesPlaceholder'),
      required: true,
      type: 'select',
    },
  ];

  const getValueFromStore = (fieldName: string) => {
    return {
      pondName,
      pondSize,
      stockingDensity,
      species,
    }[fieldName] || '';
  };

  const { data: sizeOptions, isLoading: PondSizesLoading, isError: PondSizesError } = useQuery({
    queryKey: ['pondSizes'],
    queryFn: GetPondSizes,
    refetchOnWindowFocus: false,
  });

  const { data: speciesList, isLoading: PondSpeciesLoading, isError: PondSpeciesError } = useQuery({
    queryKey: ['pondSpecies'],
    queryFn: GetPondSpecies,
    refetchOnWindowFocus: false,
  });

  const handleSubmit = async () => {
    if (!farmId) return;
  
    const newPondData = {
      name: pondName,
      size: pondSize,
      species,
      density: Number(stockingDensity) || 0,
      farmId,
      monitoring,
      deviceIds: monitoring === 'sensor' ? deviceIds : [],
    };
  
    try {
      await createPond(newPondData);
      toast({
        title: 'Pond added successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
  
      // Invalidate pond list for this farm
      queryClient.invalidateQueries({ queryKey: ['ponds', farmId] });
  
      resetForm();
      onClose();
    } catch (error) {
      toast({
        title: 'Failed to add pond',
        description: 'Please try again later.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      console.error('Error creating pond:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('form.addPondTitle')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxH="60vh" overflowY="auto">
          <Stack spacing={5}>
            {formFields.map((field) => (
              <FormControl key={field.name} isRequired={field.required}>
                <FormLabel>{field.label}</FormLabel>
                {field.type === 'input' ? (
                  <Input
                    name={field.name}
                    value={getValueFromStore(field.name)}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    bg="inputBg"
                    borderColor="borderColor"
                    focusBorderColor="green.400"
                  />
                ) : (
                  <>
                    <Select
                      name={field.name}
                      value={getValueFromStore(field.name)}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      bg="inputBg"
                      borderColor="borderColor"
                      focusBorderColor="green.400"
                      isDisabled={
                        (field.name === 'pondSize' && (PondSizesLoading || PondSizesError)) ||
                        (field.name === 'species' && (PondSpeciesLoading || PondSpeciesError))
                      }
                    >
                      {(field.name === 'pondSize' ? sizeOptions : speciesList)?.map(
                        (opt: any) => (
                          <option key={opt.name} value={opt.sizeType || opt.speciesType}>
                            {opt.name}
                          </option>
                        )
                      )}
                    </Select>

                    {field.name === 'pondSize' && PondSizesLoading && (
                      <Text fontSize="sm">{t('form.loadingPondSizes')}</Text>
                    )}
                    {field.name === 'pondSize' && PondSizesError && (
                      <Text fontSize="sm" color="red.500">
                        {t('form.failedPondSizes')}
                      </Text>
                    )}
                    {field.name === 'species' && PondSpeciesLoading && (
                      <Text fontSize="sm">{t('form.loadingSpecies')}</Text>
                    )}
                    {field.name === 'species' && PondSpeciesError && (
                      <Text fontSize="sm" color="red.500">
                        {t('form.failedSpecies')}
                      </Text>
                    )}
                  </>
                )}
              </FormControl>
            ))}

            <FormControl>
              <FormLabel>{t('form.monitoring')}</FormLabel>
              <RadioGroup
                value={monitoring}
                onChange={(val: string) => setField('monitoring', val as 'sensor' | 'manual')}
              >
                <Stack spacing={2}>
                  <Radio value="sensor">{t('form.monitoringSensor')}</Radio>
                  <Radio value="manual">{t('form.monitoringManual')}</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {monitoring === 'sensor' && (
              <FormControl>
                <FormLabel>{t('form.addDevice')}</FormLabel>
                <HStack>
                  <Input
                    placeholder={t('form.deviceIdPlaceholder')}
                    value={deviceInput}
                    onChange={(e: any) => setDeviceInput(e.target.value)}
                    bg="inputBg"
                    borderColor="borderColor"
                    focusBorderColor="green.400"
                  />
                  <Button onClick={handleAddDevice} size="sm">
                    {t('form.addDeviceBtn')}
                  </Button>
                </HStack>
                <HStack wrap="wrap" mt={2}>
                  {deviceIds.map((id) => (
                    <Tag key={id} size="sm" colorScheme="blue">
                      <TagLabel>{id}</TagLabel>
                      <TagCloseButton onClick={() => handleRemoveDevice(id)} />
                    </Tag>
                  ))}
                </HStack>
              </FormControl>
            )}
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} variant="ghost" mr={3}>
            Cancel
          </Button>
          <Button colorScheme="teal" onClick={handleSubmit}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddPondModal;