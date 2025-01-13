'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface HistoricalData {
  timestamp: string;
  value: number;
}

interface IndexHistoryProps {
  data: HistoricalData[];
}

interface TooltipContext {
  parsed: {
    y: number;
  };
}

export function IndexHistory({ data }: IndexHistoryProps) {
  console.log('IndexHistory received raw data:', JSON.stringify(data, null, 2));
  
  if (!Array.isArray(data) || data.length === 0) {
    console.warn('No historical data available');
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-gray-500">
        No historical data available
      </div>
    );
  }

  const validData = data.filter(point => {
    const isValid = point && typeof point.timestamp === 'string' && typeof point.value === 'number';
    if (!isValid) {
      console.warn('Filtering out invalid data point:', point);
    }
    return isValid;
  });

  console.log('Filtered valid data:', validData);

  const chartData = {
    datasets: [
      {
        label: 'Index Value',
        data: validData.map(point => ({
          x: new Date(point.timestamp),
          y: point.value
        })),
        borderColor: '#84CC16',
        backgroundColor: 'rgba(132, 204, 22, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            day: 'MMM d',
          },
          tooltipFormat: 'PPP',
        },
        grid: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipContext) => `Index: ${context.parsed.y}`,
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
      line: {
        tension: 0.3,
      },
    },
  };

  return (
    <div className="h-[300px] w-full">
      <Line data={chartData} options={options} />
    </div>
  );
} 