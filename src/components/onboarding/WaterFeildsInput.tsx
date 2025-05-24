// WaterFieldsInput.tsx

import React, { useState } from 'react';
import { HStack, Select, Input, Button } from '@chakra-ui/react';
import { waterFields } from './FormFeilds';

interface WaterFieldsInputProps {
  waterParams: Record<string, string>;
  setWaterParams: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setManualEntry: React.Dispatch<React.SetStateAction<any>>;
}

const WaterFieldsInput: React.FC<WaterFieldsInputProps> = ({ waterParams, setWaterParams, setManualEntry }) => {
  const [currentParam, setCurrentParam] = useState<{ name: string; value: string }>({ name: '', value: '' });

  const handleAddParameter = () => {
    if (!currentParam.name || !currentParam.value) return;

    setWaterParams((prev) => ({
      ...prev,
      [currentParam.name]: currentParam.value,
    }));

    setManualEntry((prev: any) => ({
      ...prev,
      [currentParam.name]: currentParam.value,
    }));

    setCurrentParam({ name: '', value: '' });
  };

  return (
    <>
      {/* Display submitted water parameters */}
      {Object.entries(waterParams).map(([paramName, paramValue]) => {
        const label = waterFields.find((f) => f.name === paramName)?.label || paramName;
        return (
          <HStack key={paramName} spacing={4} mt={2}>
            <Select value={paramName} isDisabled maxW="160px">
              <option>{label}</option>
            </Select>
            <Input
              value={paramValue}
              onChange={(e: any) => {
                const newValue = e.target.value;
                setWaterParams((prev) => ({
                  ...prev,
                  [paramName]: newValue,
                }));
                setManualEntry((prev: any) => ({
                  ...prev,
                  [paramName]: newValue,
                }));
              }}
            />
          </HStack>
        );
      })}

      {/* Show next input row only if not all parameters are added */}
      {Object.keys(waterParams).length < waterFields.length && (
        <HStack spacing={4} mt={4}>
          <Select
            placeholder="Parameter"
            value={currentParam.name}
            onChange={(e: any) => setCurrentParam((prev) => ({ ...prev, name: e.target.value }))}
            maxW="160px"
          >
            {waterFields
              .filter((f) => !waterParams.hasOwnProperty(f.name))
              .map((field) => (
                <option key={field.name} value={field.name}>
                  {field.label}
                </option>
              ))}
          </Select>

          {currentParam.name && (
            <Input
              placeholder="Enter value"
              type="number"
              step="any"
              value={currentParam.value}
              onChange={(e: any) => setCurrentParam((prev) => ({ ...prev, value: e.target.value }))}
            />
          )}

          <Button
            size="sm"
            onClick={handleAddParameter}
            isDisabled={!currentParam.name || !currentParam.value}
          >
            ➕
          </Button>
        </HStack>
      )}
    </>
  );
};

export default WaterFieldsInput;
