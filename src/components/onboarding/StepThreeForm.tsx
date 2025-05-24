import {
    Button,
    FormControl,
    FormLabel,
    HStack,
    Input,
    Radio,
    RadioGroup,
    Select,
    Stack,
    Tag,
    TagCloseButton,
    TagLabel,
    useToast,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { createPond, GetPondSizes, GetPondSpecies } from '@/api/pond';
import { PondFormState, usePondFormStore } from '@/store/pondFarmStore';
import { PondSizes, PondSpeices } from '@/types/ponds';
import { Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useNewFarmStore } from '@/store/farmStore';
import { useTranslation } from 'react-i18next';

  interface FormFeilds {
    name: string,
    label: string,
    placeholder: string,
    required?: boolean,
    type: string,
    options?: { label: string; value: string }[]; 
  }

  
  const StepThreeForm = () => {
    const navigate = useNavigate();
    const {t} = useTranslation('step3');
    const toast = useToast();
    const {
      pondName,
      pondSize,
      stockingDensity,
      species,
      monitoring,
      deviceIds,
      pondList,
      setField,
      addDevice,
      removeDevice,
      addPondToList,
      resetForm,
    } = usePondFormStore();
    

  
    const [deviceInput, setDeviceInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { farm } = useNewFarmStore();
  
 
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setField(name as keyof PondFormState, value);
    };
  
    const handleAddDevice = () => {
      if (!deviceInput.trim()) return;
      addDevice(deviceInput.trim());
      setDeviceInput('');
    };
    
    const handleRemoveDevice = (id: string) => {
      removeDevice(id);
    };
  
   
  
    const handleSavePond = async () => {
      if (!pondName || !pondSize || !species) {
        toast({
          title: t('form.requiredFieldsWarning'),
          status: 'warning',
          isClosable: true,
        });
        return;
      }
    
      setLoading(true);
    
      try {
      
    
        if (!farm?.id) {
          toast({
            title: t('form.farmNotFound'),
            description: t('form.farmNotFoundDesc'),
            status: 'error',
            isClosable: true,
          });
          return;
        }
    
        // Send correct body to API
        const requestBody = {
          name: pondName,
          size: pondSize,
          species,
          density: Number(stockingDensity),
          farmId: farm.id,
        };
    
        const apiResponse = await createPond(requestBody); 
        console.log('requestbody', requestBody)// 👈 updated call
    
        const fullPondData = {
          pondName,
          pondSize,
          stockingDensity,
          species,
          monitoring,
          deviceIds,
          apiPondId: apiResponse.id,
          farmId: apiResponse.farmId,
        };
    
        addPondToList(fullPondData);
        window.dispatchEvent(new Event('pondListUpdated'));
    
        toast({ title:t('form.pondAdded'), status: 'success', isClosable: true });
      } catch (error) {
        console.error('❌ Pond API failed. Saving locally.', error);
    
        const newPondData = {
          pondName,
          pondSize,
          stockingDensity,
          species,
          monitoring,
          deviceIds,
        };
    
        addPondToList(newPondData);
    
        toast({
          title: t('form.savedLocally'),
          description: t('form.savedLocallyDesc'),
          status: 'info',
          isClosable: true,
        });
      } finally {
        resetForm();
        setLoading(false);
      }
    };
    
    
  
    const handleContinue = () => {
      navigate('/get-started/step4');
    };

   

    const { data: sizeOptions, isLoading: PondSizesLoading, isError: PondSizesError } = useQuery({
      queryKey: ['pondSizes'],
      queryFn: GetPondSizes, // ✅ Fix typo
      refetchOnWindowFocus: false, // ✅ Fix casing
    });
    
    const { data: speciesList, isLoading: PondSpeciesLoading, isError: PondSpeciesError } = useQuery({
      queryKey: ['pondSpecies'],
      queryFn: GetPondSpecies, // ✅ Fix typo
      refetchOnWindowFocus: false, // ✅ Fix casing
    });
    

    const formFields: FormFeilds[] = [
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
        options: sizeOptions?.map((s: PondSizes) => ({
          label: s.name,
          value: s.sizeType,
        })) ?? [],
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
        options: speciesList?.map((s: PondSpeices) => ({
          label: s.name,
          value: s.speciesType,
        })) ?? [],
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
    
  
    return (
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
          {field.options?.map((opt: { label: string; value: string }) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
        
        {/* Loading/Error messages */}
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
  
      <Stack direction={{ base: 'column', sm: 'row' }} justify="space-between">
      <Button variant="outline" onClick={handleSavePond} isLoading={loading}>
        {t('form.savePond')}
      </Button>
      <Button variant="ghost" onClick={handleContinue}>
        {t('form.skip')}
      </Button>
      {pondList.length > 0 && (
        <Button colorScheme="green" onClick={handleContinue}>
          {t('form.continue')}
        </Button>
        )}
      </Stack>
    </Stack>
  );
  };
  
  export default StepThreeForm;