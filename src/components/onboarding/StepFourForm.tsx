import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFarms } from '@/api/farm';
import { getPonds } from '@/api/pond';
import { Farm, Pond } from '@/types/models';
import { useNewFarmStore } from '@/store/farmStore';
import { ManualDataEntry, useManualEntryStore } from '@/store/manualEntryStore';
import WaterFieldsInput from './WaterFeildsInput';
import FishFieldsInput from './FishFeildsInput';
import { useTranslation } from 'react-i18next';
import { postManualSensorData } from '@/api/sensorData';
import { fishFields, waterFields } from './FormFeilds';



type ManualFormType = 'Water' | 'Fish' | '';

const StepFourForm = () => {
  const { t } = useTranslation('step4')
  const navigate = useNavigate();
  const toast = useToast();
  const { farm } = useNewFarmStore();
  const { entries, addEntry } = useManualEntryStore();
  const [waterParams, setWaterParams] = useState<Record<string, string>>({});
 // ✅ Zustand state

  const [mode, setMode] = useState<'device' | 'manual'>('device');
  const [manualEntry, setManualEntry] = useState<Partial<ManualDataEntry> & {
    farmId: string;
    pondId: string;
    type: ManualFormType;
  }>({
    farmId: '',
    pondId: '',
    type: '',
  });

  const [farms, setFarms] = useState<Farm[]>([]);
  const [ponds, setPonds] = useState<Pond[]>([]);

  const fetchFarms = async () => {
    try {
      const data = await getFarms();
      setFarms(data);
    } catch (err) {
      console.error('❌ Failed to fetch farms:', err);
    }
  };

  const fetchPonds = async (farmId: string) => {
    try {
      const data = await getPonds(farmId);
      setPonds(data);
    } catch (err) {
      console.error('❌ Failed to fetch ponds:', err);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  useEffect(() => {
    if (farm?.id) {
      fetchPonds(farm.id);
    }
  }, [farm?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    if (name === 'pondId') {
      const selectedPond = ponds.find((pond) => pond.id === value);
      if (selectedPond) {
        setManualEntry((prev) => ({
          ...prev,
          pondId: value,
          species: selectedPond.species || '', // 🐟 Auto-fill species!
        }));
        return; // Important: return early, don't continue to normal setManualEntry
      }
    }
  
    setManualEntry((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleAddManualEntry = async () => {
    const { farmId, pondId, type } = manualEntry;


  
    if (!farmId || !pondId || !type) {
      toast({
        title: t('form.toastFillFields'),
        status: 'warning',
        isClosable: true,
      });
      return;
    }
  
    const selectedFarm = farms.find((f) => f.id === farmId);
    const selectedPond = ponds.find((p) => p.id === pondId);
  
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
      farmId,
      ponds: [pondData],
    };
  
    try {
      await postManualSensorData(body);
  
      // Update local state
      if (type === 'Water') {
        const waterEntry: ManualDataEntry = {
          type: 'Water',
          farmId,
          farmName: selectedFarm?.name || 'Unknown Farm',
          pondId,
          pondName: selectedPond?.name || 'Unknown Pond',
          ...waterFields.reduce((acc, field) => {
            acc[field.name] = manualEntry[field.name as keyof typeof manualEntry];
            return acc;
          }, {} as any),
        };
        addEntry(waterEntry);
      } else if (type === 'Fish') {
        const fishEntry: ManualDataEntry = {
          type: 'Fish',
          farmId,
          farmName: selectedFarm?.name || 'Unknown Farm',
          pondId,
          pondName: selectedPond?.name || 'Unknown Pond',
          ...fishFields.reduce((acc, field) => {
            acc[field.name] = manualEntry[field.name as keyof typeof manualEntry];
            return acc;
          }, {} as any),
        };
        addEntry(fishEntry);
      }
  
      toast({
        title: t('form.toastAdded'),
        status: 'success',
        isClosable: true,
      });
  
      setManualEntry({
        farmId: '',
        pondId: '',
        type: '',
        do: '',
        temp: '',
      });
      setWaterParams({}); 
    } catch (err) {
      console.error(err);
      toast({
        title: 'error while adding the farms',
        status: 'error',
        isClosable: true,
      });
      setWaterParams({});
    }
  };
  

  const handleContinue = () => {
    navigate('/get-started/step5');
  };




  return (
    <Stack spacing={6}>
      {/* Mode Toggle */}
      <RadioGroup onChange={(val: string) => setMode(val as 'device' | 'manual')} value={mode}>
        <HStack spacing={6}>
        <Radio value="device">{t('form.modeDevice')}</Radio>
        <Radio value="manual">{t('form.modeManual')}</Radio>
        </HStack>
      </RadioGroup>

      {mode === 'device' ? (
        <Box>
          <Text fontSize="sm" color={'mutedText'}>
          {t('form.deviceInfo')}
          </Text>
          <Box
            mt={4}
            p={4}
            border="1px dashed"
            borderColor={'bgTrack'}
            borderRadius="md"
            color={'mutedText'}
          >
             {t('form.devicePlaceholder')}
          </Box>
        </Box>
      ) : (
        <>
          <FormControl isRequired>
            <FormLabel>{t('form.selectFarm')}</FormLabel>
            <Select name="farmId" value={manualEntry.farmId} onChange={handleChange}>
              <option value="">{t('form.optionSelect')}</option>
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{t('form.selectPond')}</FormLabel>
            <Select name="pondId" value={manualEntry.pondId} onChange={handleChange}>
              <option value="">{t('form.optionSelect')}</option>
              {ponds.map((pond) => (
                <option key={pond.id} value={pond.id}>
                  {pond.name}
                </option>
              ))}
            </Select>
          </FormControl>


          <FormControl isRequired>
            <FormLabel>{t('form.selectDataType')}</FormLabel>
            <Select name="type" value={manualEntry.type} onChange={handleChange}>
              <option value="">{t('form.optionSelect')}</option>
              <option value="Water">{t('form.optionWater')}</option>
              <option value="Fish">{t('form.optionFish')}</option>
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
            <FishFieldsInput
              manualEntry={manualEntry}
              handleChange={handleChange}
            />
          )}

         

         <Button mt={2} size="sm" onClick={handleAddManualEntry}>
            {t('form.addMore')}
          </Button>


          {entries.length > 0 && (
            <Box mt={4}>
              <Text fontSize="sm" fontWeight="bold" mb={2}>
                {t('form.manualEntries')}
              </Text>
              <Stack spacing={2}>
                {entries.map((entry, i) => (
                  <Box
                    key={i}
                    p={3}
                    border="1px solid"
                    borderColor="borderColor"
                    borderRadius="md"
                    fontSize="sm"
                    bg={'cardBg'}
                  >
                    <Text>{t('form.entryFarmPond', { farm: entry.farmName, pond: entry.pondName })}</Text>
                    <Text>{t('form.entryType', { type: entry.type })}</Text>

                    {entry.type === 'Water' && (
                        <>
                          {waterFields.map(({ name, label }) => {
                            const value = entry[name as keyof typeof entry];
                            if (value !== undefined && value !== '') {
                              return <Text key={name}>{`${label}: ${value}`}</Text>;
                            }
                            return null;
                          })}
                        </>
                      )}

                      {entry.type === 'Fish' && (
                          <>
                            {fishFields.map(({ name, label }) => {
                              const value = entry[name as keyof typeof entry];
                              if (value !== undefined && value !== '') {
                                return <Text key={name}>{`${label}: ${value}`}</Text>;
                              }
                              return null;
                            })}
                          </>
                        )}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </>
      )}


      {/* Navigation Buttons */}
      <Stack direction={{ base: 'column', sm: 'row' }} justify="space-between">
      <Button variant="ghost" onClick={handleContinue}>
          {t('form.skip')}
        </Button>
        <Button colorScheme="blackAlpha" onClick={handleContinue}>
          {t('form.continue')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default StepFourForm;
