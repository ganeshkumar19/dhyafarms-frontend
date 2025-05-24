import React from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { fishFields } from './FormFeilds';


interface FishFieldsInputProps {
  manualEntry: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const FishFieldsInput: React.FC<FishFieldsInputProps> = ({ manualEntry, handleChange }) => {
  return (
    <>
        {fishFields.map((field) => (
        <FormControl key={field.name}>
          <FormLabel>{field.label}</FormLabel>
          <Input
            name={field.name}
            value={manualEntry[field.name] || ''}
            onChange={handleChange}
            type={field.type || 'text'}
            step="any"
            isDisabled={field.name === 'species'} 
          />
        </FormControl>
      ))}
    </>
  );
};

export default FishFieldsInput;
