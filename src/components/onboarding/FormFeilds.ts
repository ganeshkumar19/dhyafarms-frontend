export const waterFields = [
    { name: 'do', label: 'DO (mg/L)' },
    { name: 'temp', label: 'Temp (°C)' },
    { name: 'ph', label: 'pH' },
    { name: 'ammonia', label: 'Ammonia' },
    { name: 'nitrite', label: 'Nitrite' },
    { name: 'nitrate', label: 'Nitrate' },
    { name: 'salinity', label: 'Salinity' },
    { name: 'turbidity', label: 'Turbidity' },
    { name: 'tds', label: 'TDS' },
    { name: 'orp', label: 'ORP' },
    { name: 'chlorine', label: 'Chlorine' },
    { name: 'water_level', label: 'Water Level' },
  ];
  
  export const fishFields = [
    { name: 'species', label: 'Species', type: 'text' },
    { name: 'avg_weight', label: 'Average Weight (g)', type: 'number' },
    { name: 'total_stock', label: 'Total Stock (g)', type: 'number' },
    { name: 'feed_today', label: 'Feed Today (g)', type: 'number' },
    { name: 'days_in_cycle', label: 'Days in Cycle', type: 'number' },
  ];