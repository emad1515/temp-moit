import styled from 'styled-components';
import Heading from '../../ui/Heading';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useDarkMode } from '../../context/DarkModeContext';

const ChartBox = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 2.4rem 3.2rem;
  grid-column: 3 / span 2;

  & > *:first-child {
    margin-bottom: 1.6rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }
`;

const startDataLight = [
  // {
  //   response: 'immediately',
  //   value: 0,
  //   color: '#f05b5b',
  // },
  {
    response: '1 day',
    value: 0,
    color: '#ef4444',
  },
  {
    response: '2 days',
    value: 0,
    color: '#f97316',
  },
  {
    response: '3 days',
    value: 0,
    color: '#eab308',
  },
  {
    response: '4-5 days',
    value: 0,
    color: '#84cc16',
  },
  {
    response: '6-7 days',
    value: 0,
    color: '#22c55e',
  },
  {
    response: '8-14 days',
    value: 0,
    color: '#14b8a6',
  },
  {
    response: '15-21 days',
    value: 0,
    color: '#3b82f6',
  },
  {
    response: '21+ days',
    value: 0,
    color: '#a855f7',
  },
];

const startDataDark = [
  // {
  //   response: 'immediately',
  //   value: 0,
  //   color: '#c44a4a',
  // },
  {
    response: '1 day',
    value: 0,
    color: '#b91c1c',
  },
  {
    response: '2 days',
    value: 0,
    color: '#c2410c',
  },
  {
    response: '3 days',
    value: 0,
    color: '#a16207',
  },
  {
    response: '4-5 days',
    value: 0,
    color: '#4d7c0f',
  },
  {
    response: '6-7 days',
    value: 0,
    color: '#15803d',
  },
  {
    response: '8-14 days',
    value: 0,
    color: '#0f766e',
  },
  {
    response: '15-21 days',
    value: 0,
    color: '#1d4ed8',
  },
  {
    response: '21+ days',
    value: 0,
    color: '#7e22ce',
  },
];

function prepareData(startData, processing) {
  // A bit ugly code, but sometimes this is what it takes when working with real data 😅

  function incArrayValue(arr, field) {
    return arr.map(obj =>
      obj.response === field ? { ...obj, value: obj.value + 1 } : obj
    );
  }

  const data = processing
    .reduce((arr, cur) => {
      const num = cur.responseDays;
      // if (num === 0) return incArrayValue(arr, 'immediately');
      if (num === 1) return incArrayValue(arr, '1 day');
      if (num === 2) return incArrayValue(arr, '2 days');
      if (num === 3) return incArrayValue(arr, '3 days');
      if ([4, 5].includes(num)) return incArrayValue(arr, '4-5 days');
      if ([6, 7].includes(num)) return incArrayValue(arr, '6-7 days');
      if (num >= 8 && num <= 14) return incArrayValue(arr, '8-14 days');
      if (num >= 15 && num <= 21) return incArrayValue(arr, '15-21 days');
      if (num >= 21) return incArrayValue(arr, '21+ days');
      return arr;
    }, startData)
    .filter(obj => obj.value > 0);

  return data;
}

function ResponseDaysChart({ startedProcessing }) {
  const { isDarkMode } = useDarkMode();
  const startData = isDarkMode ? startDataDark : startDataLight;
  const data = prepareData(startData, startedProcessing);

  return (
    <ChartBox>
      <Heading as='h2'> Response day summary</Heading>
      <ResponsiveContainer height={240} width='100%'>
        <PieChart>
          <Pie
            data={data}
            nameKey='response'
            dataKey='value'
            innerRadius={85}
            outerRadius={110}
            cx='40%'
            cy='50%'
            paddingAngle={3}
          >
            {data.map(entry => (
              <Cell
                fill={entry.color}
                stroke={entry.color}
                key={entry.response}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign='middle'
            align='right'
            width='30%'
            layout='vertical'
            iconSize={15}
            iconType='circle'
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}

export default ResponseDaysChart;
