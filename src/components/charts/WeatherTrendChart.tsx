import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

interface LineChartComponentProps {
  data: any[];
  selectedKeys: string[];
}

const WeatherTrendChart = ({ data, selectedKeys }: LineChartComponentProps) => {
  // Define colors for each metric
  const metricColors: { [key: string]: string } = {
    temp: '#3182CE',
    humidity: '#FF6347', // Tomato
    wind: '#32CD32', // LimeGreen
    rain: '#FFD700', // Gold
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        {selectedKeys.map((key) => {
          // Extract the metric from the key (e.g., 'WS-001_temp' => 'temp')
          const metric = key.split('_')[1]; 
          const lineColor = metricColors[metric] || '#3182CE'; // Default color if not found
          
          return (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeatherTrendChart;
