import { registerDevice } from '@/api/device';
import { useAuthStore } from '@/hooks/useAuthStore';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';


interface AddDeviceModalProps {
  pondId: string;
  onSuccess: () => void;
}

interface AvailableDevice {
  deviceId: string;
  type: string;
  timestamp: string;
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ pondId, onSuccess }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [availableDevices, setAvailableDevices] = useState<AvailableDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [manualDeviceId, setManualDeviceId] = useState('');
  const [location, setLocation] = useState('Underwater');
  const [type, setType] = useState('sensor');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!isOpen) return;

    const ws = new WebSocket('ws://localhost:3000/ws/dashboard');

    ws.onopen = () => console.log('🌐 Connected to live device WS');

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.device_id && msg.data?.isLive) {
          const newDevice: AvailableDevice = {
            deviceId: msg.device_id,
            type: msg.type || 'sensor',
            timestamp: msg.timestamp,
          };

          setAvailableDevices((prev) => {
            const exists = prev.find((d) => d.deviceId === newDevice.deviceId);
            if (exists) return prev;
            return [...prev, newDevice];
          });
        }
      } catch (err) {
        console.warn('❌ Invalid WS device data:', err);
      }
    };

    ws.onerror = (err) => console.error('❌ WebSocket error:', err);
    ws.onclose = () => console.warn('⚠️ WebSocket closed');

    return () => ws.close();
  }, [isOpen]);

  const handleSubmit = async () => {
    const deviceIdToUse = selectedDeviceId || manualDeviceId;

    if (!deviceIdToUse) {
      toast({ status: 'warning', title: 'Device ID is required' });
      return;
    }

    if (!user?.id) {
      toast({ status: 'error', title: 'User not authenticated' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        deviceId: deviceIdToUse,
        type,
        location,
        pondId,
        status: 'active',
        userId: user.id,
      };

      await registerDevice(payload);

      toast({ status: 'success', title: 'Device linked successfully' });
      onClose();
      onSuccess();
      setSelectedDeviceId('');
      setManualDeviceId('');
    } catch (err) {
      console.error('Device register error:', err);
      toast({ status: 'error', title: 'Failed to register device' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button colorScheme="blue" size="sm" onClick={onOpen}>
        + Add Device
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Register New Device</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Select Available Device</FormLabel>
              <Select
                placeholder="Choose from live stream"
                value={selectedDeviceId}
                onChange={(e: { target: { value: any; }; }) => {
                  const selected = e.target.value;
                  setSelectedDeviceId(selected);
                  setManualDeviceId('');
                  const device = availableDevices.find((d) => d.deviceId === selected);
                  if (device?.type) setType(device.type);
                }}
              >
                {availableDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.deviceId} ({device.type})
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Or Enter Device ID Manually</FormLabel>
              <Input
                placeholder="e.g. UWDRONE-001"
                value={manualDeviceId}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => {
                  setManualDeviceId(e.target.value);
                  setSelectedDeviceId('');
                }}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Device Type</FormLabel>
              <Select value={type} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setType(e.target.value)}>
                <option value="aqis">AQIS</option>
                <option value="weather">Weather</option>
                <option value="drone">Drone</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Device Location</FormLabel>
              <Input
                placeholder="e.g. Underwater near feeder"
                value={location}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setLocation(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              isLoading={loading}
              onClick={handleSubmit}
              isDisabled={!selectedDeviceId && !manualDeviceId}
            >
              Register
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddDeviceModal;