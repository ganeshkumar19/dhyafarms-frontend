import { createFarm, getFarmSizes, getFarmTypes, getFarmWaterSources } from '@/api/farm';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Textarea,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useStepTwoFormStore } from '@/store/stepTwoFormStore';
import { useOnboardingStore } from '@/store/onBoardingStore';
import { CreateFarm } from '@/types/farms';
import { useNewFarmStore } from '@/store/farmStore';
import { useTranslation } from 'react-i18next';



const StepTwoForm = () => {
  const navigate = useNavigate();
  const onboardingForm = useOnboardingStore((state) => state.form);
  const setNewFarm = useNewFarmStore((state) => state.setNewFarm);
  const toast = useToast();

  const {
    farmName, farmSize, farmType, waterSource, notes, devices, newDevice,
    setForm,
  } = useStepTwoFormStore();

  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('step2');

  useEffect(() => {
    setIsFormValid(!!(farmName && farmSize && farmType && waterSource));
  }, [farmName, farmSize, farmType, waterSource]);

  const handleChange = (
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

  const handleContinue = async () => {
    setLoading(true);

  
    const payload: CreateFarm = {
      name: farmName,
      size: farmSize,
      type: farmType,
      watersrc: waterSource,
      latitude: onboardingForm.lat,
      longitude: onboardingForm.long,
      location: onboardingForm.location,
      notes: notes,
      device: devices.join(','),
    };
  
    try {
      const response = await createFarm(payload);

      console.log('farm created', response)

      setNewFarm(response);
  
      
  
      toast({
        title: 'Farm Created',
        description: `Farm "${response.name}" created successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
  
      navigate('/get-started/step3');
    } catch (error) {
      toast({
        title: 'Failed to create farm',
        description: 'Saved locally. You can sync later.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
  
      navigate('/get-started/step3');
    } finally {
      setLoading(false);
    }
  };
  
  

  // Query farm types from API
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
  }= useQuery({
    queryKey: ['farmSizes'],
    queryFn: getFarmSizes,
    refetchOnWindowFocus: false
  })

  const {
    data: waterSources = [],
    isLoading: waterSourcesLoading,
    isError: waterSourcesError,
  }= useQuery({
    queryKey: ['waterSources'],
    queryFn: getFarmWaterSources,
    refetchOnWindowFocus: false
  })

  return (
    <form>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>{t('form.farmName')}</FormLabel>
          <Input
            name="farmName"
            type="text"
            placeholder={t('form.farmNamePlaceholder')}
            value={farmName}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>{t('form.farmSize')}</FormLabel>
          <Select name="farmSize" value={farmSize} onChange={handleChange}>
            <option value="">{t('form.selectSize')}</option>
            {farmSizes.map((size) => (
            <option key={size.id} value={size.sizeType}>
              {size.name}
            </option>
          ))}
          </Select>
          {farmSizesLoading && <Text fontSize="sm">{t('form.loadingFarmSizes')}</Text>}
          {farmSizesError && <Text fontSize="sm" color="red.500">{t('form.errorFarmSizes')}</Text>}
        </FormControl>

        <FormControl isRequired>
          <FormLabel>{t('form.farmType')}</FormLabel>
          <Select name="farmType" value={farmType} onChange={handleChange} isDisabled={farmTypesLoading || farmTypesError}>
            <option value="">{t('form.selectType')}</option>
            {farmTypeOptions.map(({ id, name, farmType }) => (
              <option key={id} value={farmType}>
                {name}
              </option>
            ))}
          </Select>
          {farmTypesLoading && <Text fontSize="sm">{t('form.loadingFarmTypes')}</Text>}
          {farmTypesError && <Text fontSize="sm" color="red.500">{t('form.errorFarmTypes')}</Text>}
        </FormControl>

        <FormControl isRequired>
          <FormLabel>{t('form.waterSource')}</FormLabel>
          <Select name="waterSource" value={waterSource} onChange={handleChange}>
            <option value="">{t('form.selectWaterSource')}</option>
            {waterSources.map((source) => (
              <option key={source.id} value={source.srcType}>
                {source.name}
              </option>
            ))}   
          </Select>
          {waterSourcesLoading && <Text fontSize="sm">{t('form.loadingWaterSources')}</Text>}
          {waterSourcesError && <Text fontSize="sm" color="red.500">{t('form.loadingWaterSources')}</Text>}
        </FormControl>

        <FormControl>
          <FormLabel>{t('form.notes')}</FormLabel>
          <Textarea
            name="notes"
            placeholder={t('form.notesPlaceholder')}
            value={notes}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>{t('form.devices')}</FormLabel>
          <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
            <Input
              placeholder={t('form.devicePlaceholder')}
              name="newDevice"
              value={newDevice}
              onChange={handleChange}
            />
            <Button onClick={handleAddDevice} size="sm">
            {t('form.addDevice')}
            </Button>
          </Stack>
          {devices.length > 0 && (
            <Box fontSize="sm" mt={2} color="headingColor">
              {t('form.deviceList')}: {devices.join(', ')}
            </Box>
          )}
        </FormControl>

        <Stack direction={{ base: 'column', sm: 'row' }} justify="space-between" mt={4}>
          <Button variant="outline" size="sm" onClick={() => navigate('/get-started/step3')}>
             {t('form.skip')}
          </Button>
          <Button
            colorScheme="blackAlpha"
            size="sm"
            onClick={handleContinue}
            isDisabled={!isFormValid}
            isLoading={loading}
          >
            {t('form.continue')}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default StepTwoForm;

