export const formatLabel = (key: string): string => {
    const labelMap: Record<string, string> = {
      temp_c: 'Temperature (°C)',
      do_mg_l: 'DO (mg/L)',
      water_level: 'Water Level',
      avgWeight: 'Avg Weight',
      feedToday: 'Feed Today',
      growthRate: 'Growth Rate',
      totalStock: 'Total Stock',
    };
  
    return labelMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  };
  
  export const isValidDate = (value: string): boolean => {
    const parsedDate = new Date(value);
    return !isNaN(parsedDate.getTime());
  };
  
  export const getVisibleData = (pond: Record<string, any>) =>
    Object.entries(pond).filter(
      ([key, value]) =>
        !excludedKeys.includes(key) &&
        value !== null &&
        value !== 0 &&
        value !== '' &&
        value !== undefined
    );
  
  export const excludedKeys: string[] = [
    'id',
    'name',
    'farmId',
    'deletedAt',
    'updatedAt',
    'createdAt',
    'devices',
    'sensorSummary',
    'lastFeed',
  ];
  
export const formatLogDetails = (log: any) => {
    const valueMap = {
      temp_c: `Temp: ${log.temp_c}°C`,
      ph: `pH: ${log.ph}`,
      do_mg_l: `DO: ${log.do_mg_l} mg/L`,
      salinity: `Salinity: ${log.salinity}`,
      orp: `ORP: ${log.orp}`,
      tds: `TDS: ${log.tds}`,
      turbidity: `Turbidity: ${log.turbidity}`,
      nitrate: `Nitrate: ${log.nitrate}`,
      nitrite: `Nitrite: ${log.nitrite}`,
      chlorine: `Chlorine: ${log.chlorine}`,
      ammonia: `Ammonia: ${log.ammonia}`,
      water_level: `Water Level: ${log.water_level}`,
    };

    return Object.entries(valueMap)
      .filter(([key]) => log[key] !== 0 && log[key] !== undefined)
      .map(([_, val]) => val)
      .join(', ');
  };

export const getBadgeColor = (type: string) => {
    switch (type) {
      case 'alert': return 'red';
      case 'manual': return 'yellow';
      default: return 'green';
    }
  };