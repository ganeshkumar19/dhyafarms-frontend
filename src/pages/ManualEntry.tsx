import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  VStack,
  Heading,
  useToast,
 
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import axios from 'axios';
import WaterFieldsInput from '@/components/onboarding/WaterFeildsInput';
import FishFieldsInput from '@/components/onboarding/FishFeildsInput';
import { useTranslation } from 'react-i18next';
import { useFarmStore } from '@/store/farmsGlobal';
import { postManualSensorData } from '@/api/sensorData';
import { fishFields, waterFields } from '@/components/onboarding/FormFeilds';


interface PondOption {
  id: string;
  name: string;
  species?: string; // <-- add this line
}

type ManualFormType = 'Water' | 'Fish' | '';

const ManualEntry = () => {
  const {t}= useTranslation('mentry')
  const token = useAuthStore((s) => s.token);
  const toast = useToast();
  const { activeFarmId } = useFarmStore();


  const [ponds, setPonds] = useState<PondOption[]>([]);
  const [waterParams, setWaterParams] = useState<Record<string, string>>({});

  const [manualEntry, setManualEntry] = useState<{
    farmId: string;
    pondId: string;
    type: ManualFormType;
    [key: string]: any;
  }>({
    farmId: '',
    pondId: '',
    type: '',
  });

  const fetchPonds = async () => {
    if (!activeFarmId) return;
  
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/ponds?farmId=${activeFarmId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Ponds:', res.data);
      setPonds(res.data || []);
    } catch (err) {
      toast({
        title: 'Failed to load ponds',
        status: 'error',
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchPonds();
  }, [token, toast, activeFarmId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    if (name === 'pondId') {
      const selectedPond = ponds.find((pond) => pond.id === value);
      if (selectedPond) {
        setManualEntry((prev) => ({
          ...prev,
          pondId: value,
          species: selectedPond.species || '', // set species automatically
        }));
        return; // important: return early
      }
    }
  
    setManualEntry((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleSubmit = async () => {
    const { pondId, type } = manualEntry;
  
    if (!activeFarmId || !pondId || !type) {
      toast({
        title: t('toastFillFields'),
        status: 'warning',
        isClosable: true,
      });
      return;
    }
  
    const pondData: any = { pondId };
   if (type === 'Water') {
        const water = waterFields.reduce((acc, field) => {
          const value = manualEntry[field.name as keyof typeof manualEntry];
          if (value !== '' && value !== undefined) {
            // Map 'temp' -> 'temp_c', 'do' -> 'do_mg_l', others stay same
            const key =
              field.name === 'temp'
                ? 'temp_c'
                : field.name === 'do'
                ? 'do_mg_l'
                : field.name;
            acc[key] = Number(value);
          }
          return acc;
        }, {} as Record<string, number>);
    
        if (Object.keys(water).length > 0) {
          pondData.water = water;
        }
      }
    
      if (type === 'Fish') {
        const fish = fishFields.reduce((acc, field) => {
          const value = manualEntry[field.name as keyof typeof manualEntry];
          if (value !== '' && value !== undefined) {
            acc[field.name] =
              typeof value === 'string' && field.type !== 'number'
                ? value
                : Number(value);
          }
          return acc;
        }, {} as Record<string, string | number>);
    
        if (Object.keys(fish).length > 0) {
          pondData.fish = fish;
        }
      }
  
    const body = {
      farmId: activeFarmId,
      ponds: [pondData],
    };

    console.log('body', body);
  
    try {
      await postManualSensorData(body);
  
      toast({
        title: t('toastAdded'),
        status: 'success',
        isClosable: true,
      });
  
      setManualEntry({
        farmId: '',
        pondId: '',
        type: '',
      });
      setWaterParams({});
    } catch (err) {
      console.error(err);
      toast({
        title: t('toastError'),
        status: 'error',
        isClosable: true,
      });
    }
  };
  
  return (
 
      <Box
        maxW="lg"
        mx="auto"
        p={6}
        bg="cardBg"
        borderRadius="md"
        border="1px solid"
        borderColor={"manualBorderColor"}
        boxShadow="md"
      >
        <Heading size="md" mb={6}>
          {t('title')}
        </Heading>

        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>{t('selectPond')}</FormLabel>
            <Select name="pondId" value={manualEntry.pondId} onChange={handleChange}>
              <option value="">{t('selectPondPlaceholder')}</option>
              {ponds.map((pond) => (
                <option key={pond.id} value={pond.id}>
                  {pond.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{t('selectType')}</FormLabel>
            <Select name="type" value={manualEntry.type} onChange={handleChange}>
              <option value="">{t('selectTypePlaceholder')}</option>
              <option value="Water">{t('water')}</option>
              <option value="Fish">{t('fish')}</option>
            </Select>
          </FormControl>

          {manualEntry.type === 'Water' && (
            <WaterFieldsInput
              waterParams={waterParams}
              setWaterParams={setWaterParams}
              setManualEntry={setManualEntry}
            />
          )}

          {manualEntry.type === 'Fish' && (
            <FishFieldsInput manualEntry={manualEntry} handleChange={handleChange} />
          )}

          <Button colorScheme="green" onClick={handleSubmit}>
            {t('submit')}
          </Button>
        </VStack>
      </Box>
    );
  };
  
  export default ManualEntry;