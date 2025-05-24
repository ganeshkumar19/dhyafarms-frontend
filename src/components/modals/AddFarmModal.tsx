import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Textarea,
  Box,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useStepTwoFormStore } from '@/store/stepTwoFormStore';
import { useQuery } from '@tanstack/react-query';
import {
  createFarm,
  getFarmSizes,
  getFarmTypes,
  getFarmWaterSources,
} from '@/api/farm';
import { useTranslation } from 'react-i18next';
import { useOnboardingStore } from '@/store/onBoardingStore';
import { fetchLocation } from '@/api/location';
import { CreateFarm } from '@/types/farms';


interface AddFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFarmCreated: () => void | Promise<void>;
}

const AddFarmModal: React.FC<AddFarmModalProps> = ({ isOpen, onClose, onFarmCreated }) => {
  const {
    farmName,
    farmSize,
    farmType,
    waterSource,
    notes,
    devices,
    newDevice,
    setForm,
    resetForm,
  } = useStepTwoFormStore();

  const setOnboardingForm = useOnboardingStore((state) => state.setForm);
  const onboardingForm = useOnboardingStore((state) => state.form);

  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('step2');

  const isFormValid = !!(farmName && farmSize && farmType && waterSource);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ [name]: value });
  };

  const handleAddDevice = () => {
    const trimmed = newDevice.trim();
    if (trimmed) {
      setForm({
        devices: [...devices, trimmed],
        newDevice: '',
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast({
        title: 'Missing required fields',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    const payload: CreateFarm = {
      name: farmName,
      size: farmSize,
      type: farmType,
      watersrc: waterSource,
      latitude: onboardingForm.lat,
      longitude: onboardingForm.long,
      location: onboardingForm.location,
      notes,
      device: devices.join(','),
    };

    try {
      const response = await createFarm(payload);
      toast({
        title: 'Farm Created',
        description: `Farm "${response.name}" created successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      resetForm();
      await onFarmCreated();
      onClose();
    } catch (error) {
      console.error('❌ Error creating farm:', error);
      toast({
        title: 'Failed to create farm',
        description: 'Saved locally. You can sync later.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAndSetLocation = async () => {
      const locationData = await fetchLocation();
      if (locationData) setOnboardingForm(locationData);
    };
    getAndSetLocation();
  }, [setOnboardingForm]);

  // Queries
  const {
    data: farmTypeOptions = [],
    isLoading: farmTypesLoading,
    isError: farmTypesError,
  } = useQuery({
    queryKey: ['farmTypes'],
    queryFn: getFarmTypes,
    refetchOnWindowFocus: false,
  });

  const {
    data: farmSizes = [],
    isLoading: farmSizesLoading,
    isError: farmSizesError,
  } = useQuery({
    queryKey: ['farmSizes'],
    queryFn: getFarmSizes,
    refetchOnWindowFocus: false,
  });

  const {
    data: waterSources = [],
    isLoading: waterSourcesLoading,   
    isError: waterSourcesError,    
 } = useQuery({
    queryKey: ['waterSources'],
    queryFn: getFarmWaterSources,
    refetchOnWindowFocus: false
 });
 
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('form.addFarm') || 'Add New Farm'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={4} maxH="60vh" overflowY="auto">
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>{t('form.farmName')}</FormLabel>
              <Input
                name="farmName"
                value={farmName}
                onChange={handleInputChange}
                placeholder={t('form.farmNamePlaceholder')}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{t('form.farmSize')}</FormLabel>
              <Select name="farmSize" value={farmSize} onChange={handleInputChange}>
                <option value="">{t('form.selectSize')}</option>
                {farmSizes.map((size) => (
                  <option key={size.id} value={size.sizeType}>
                    {size.name}
                  </option>
                ))}
              </Select>
              {farmSizesLoading && <Text fontSize="sm">{t('form.loadingFarmSizes')}</Text>}
              {farmSizesError && (
                <Text fontSize="sm" color="red.500">
                  {t('form.errorFarmSizes')}
                </Text>
              )}
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{t('form.farmType')}</FormLabel>
              <Select name="farmType" value={farmType} onChange={handleInputChange}>
                <option value="">{t('form.selectType')}</option>
                {farmTypeOptions.map(({ id, name, farmType }) => (
                  <option key={id} value={farmType}>
                    {name}
                  </option>
                ))}
              </Select>
              {farmTypesLoading && <Text fontSize="sm">{t('form.loadingFarmTypes')}</Text>}
              {farmTypesError && (
                <Text fontSize="sm" color="red.500">
                  {t('form.errorFarmTypes')}
                </Text>
              )}
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{t('form.waterSource')}</FormLabel>
              <Select name="waterSource" value={waterSource} onChange={handleInputChange}>
                <option value="">{t('form.selectWaterSource')}</option>
                {waterSources.map((source) => (
                  <option key={source.id} value={source.srcType}>
                    {source.name}
                  </option>
                ))}
              </Select>
              {waterSourcesLoading && <Text fontSize="sm">{t('form.loadingWaterSources')}</Text>}
              {waterSourcesError && (
                <Text fontSize="sm" color="red.500">
                  {t('form.errorWaterSources')}
                </Text>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>{t('form.notes')}</FormLabel>
              <Textarea
                name="notes"
                placeholder={t('form.notesPlaceholder')}
                value={notes}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>{t('form.devices')}</FormLabel>
              <Stack direction="row" spacing={2}>
                <Input
                  name="newDevice"
                  placeholder={t('form.devicePlaceholder')}
                  value={newDevice}
                  onChange={handleInputChange}
                />
                <Button onClick={handleAddDevice}>
                  {t('form.addDevice') || 'Add'}
                </Button>
              </Stack>
              {devices.length > 0 && (
                <Box fontSize="sm" mt={2}>
                  {t('form.deviceList')}: {devices.join(', ')}
                </Box>
              )}
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} variant="ghost" mr={3}>
            {t('form.cancel') || 'Cancel'}
          </Button>
          <Button onClick={handleSubmit} colorScheme="green" isLoading={loading}>
            {t('form.submit') || 'Add'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddFarmModal;