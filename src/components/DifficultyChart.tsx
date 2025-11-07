import { ChartData } from '../App';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DifficultyChartProps {
  data: ChartData[];
}

const DIFFICULTY_COLORS: Record<string, string> = {
  'Easy': '#10b981',    // green
  'Medium': '#f59e0b',  // amber
  'Hard': '#ef4444',    // red
};

export function DifficultyChart({ data }: DifficultyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={DIFFICULTY_COLORS[entry.name] || '#6366f1'} 
            />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
