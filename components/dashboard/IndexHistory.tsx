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

interface HistoricalDataPoint {
  timestamp: string;  // "DD/MM/YYYY, HH:mm:ss UTC"
  score: number;
  label: string;
  components: {
    market: number;
    sentiment: number;
    onChain: number;
  };
  details: {
    marketMetrics: Record<string, number>;
    sentimentMetrics: Record<string, number>;
    onChainMetrics: Record<string, number>;
  };
}

interface IndexHistoryProps {
  data: HistoricalDataPoint[];
}

interface TooltipContext {
  parsed: {
    y: number;
  };
}

function parseDate(dateStr: string) {
  // Input format: "DD/MM/YYYY, HH:mm:ss UTC"
  const [datePart, timePart] = dateStr.split(', ');
  const [day, month, year] = datePart.split('/');
  const [time] = timePart.split(' '); // Remove UTC
  
  // Create date in format: "YYYY-MM-DD HH:mm:ss"
  return new Date(`${year}-${month}-${day} ${time}`);
}

export function IndexHistory({ data }: IndexHistoryProps) {
  console.log('IndexHistory received data:', data);
  
  if (!Array.isArray(data)) {
    console.error('Data is not an array:', data);
    return (
      <div className="h-[300px] w-full flex flex-col items-center justify-center text-gray-500">
        <div>No historical data available</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-gray-500">
        No historical data available
      </div>
    );
  }

  const validData = data.filter(point => {
    const isValid = point && 
                   typeof point.timestamp === 'string' && 
                   typeof point.score === 'number' &&
                   !isNaN(point.score);
    if (!isValid) {
      console.warn('Invalid data point:', point);
    }
    return isValid;
  });

  const chartData = {
    datasets: [
      {
        label: 'Index Value',
        data: validData.map(point => ({
          x: parseDate(point.timestamp),
          y: point.score
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
            day: 'dd/MM',
          },
          tooltipFormat: 'dd/MM/yyyy HH:mm',
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
    <div className="w-full">
      <div className="h-[300px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
} 