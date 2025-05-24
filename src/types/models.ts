// src/types/models.ts

export interface Farm {
  id: string;
  name: string;
  farmSize: string;
  farmType: string;
  notes: string;
  waterSrc: string;
  location: string;
  ownerId: string;
  createdAt: string;
}

export interface Pond {
  id: string;
  name: string;
  size: string;
  species: string;
  farmId: string;
  ammonia: number;
  avgWeight: number;
  chlorine: number;
  createdAt: string;
  daysInCycle: number;
  deletedAt: string | null;
  density: number;
  devices: any[]; // You can replace `any` with a specific `Device` type if available
  do_mg_l: number;
  fcr: number;
  feedToday: number;
  growthRate: number;
  lastFeed: string | null;
  nitrate: number;
  nitrite: number;
  orp: number;
  ph: number;
  salinity: number;
  sensorSummary: any | null; // Define a type if sensorSummary has structure
  tds: number;
  temp_c: number;
  totalStock: number;
  turbidity: number;
  updatedAt: string;
  water_level: number;
}
export interface AQISData {
  ammonia: number | undefined;
  nitrite: number | undefined;
  nitrate: number | undefined;
  salinity: number | undefined;
  turbidity: number | undefined;
  tds: number | undefined;
  orp: number | undefined;
  chlorine: number | undefined;
  water_level: number | undefined;
  battery_level: number | undefined;
  signal_strength: number | undefined;
  do_mg_l: number;
  ph: number;
  temp_c: number;
}

export interface WSData {
  wind_direction_deg: number | undefined;
  solar_rotation_deg: number | undefined;
  uvi_index: number | undefined;
  light_intensity_lux: number | undefined;
  baro_pressure_hpa: number | undefined;
  rainfall_mm: number | undefined;
  battery_level: number | undefined;
  signal_strength: number | undefined;
  air_temp_c: number;
  humidity_percent: number;
  wind_speed_mps: number;
}

export interface LiveData {
  type: 'aqis' | 'weather' | 'drone';
  device_id: string;
  timestamp?: string;
  data: AQISData | WSData | Record<string, any>; // add 'drone' type later
}

export interface AlertItem {
  id: string;
  deviceId: string;
  farmName: string;
  pondName: string;
  type: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

export interface NotificationItem {
  id: number;
  userId: string;
  type: string;
  farmId: string;
  pondId: string;
  notifyType: string;
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  expiresAt: string;
  createdAt: string;
}