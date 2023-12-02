import styled from 'styled-components';
import DashboardBox from './DashboardBox';
import Heading from '../../ui/Heading';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDarkMode } from '../../context/DarkModeContext';
import { eachDayOfInterval, format, isSameDay, subDays } from 'date-fns';

const StyledMailingsChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function MailingsChart({ mailings, numDays }) {
  const { isDarkMode } = useDarkMode();

  const allDates = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1),
    end: new Date(),
  });

  const data = allDates.map(date => {
    return {
      label: format(date, 'MMM dd'),
      totalIncoming: mailings.filter(
        mailing =>
          isSameDay(date, new Date(mailing.createdAt)) &&
          (mailing.type === 'incoming' || mailing.type === 'localIncoming')
      ).length,
      totalOutgoing: mailings.filter(
        mailing =>
          isSameDay(date, new Date(mailing.createdAt)) &&
          (mailing.type === 'outgoing' ||
            mailing.type === 'localOutgoing' ||
            mailing.type === 'private')
      ).length,
    };
  });

  const colors = isDarkMode
    ? {
        totalIncoming: { stroke: '#4f46e5', fill: '#4f46e5' },
        totalOutgoing: { stroke: '#22c55e', fill: '#22c55e' },
        text: '#e5e7eb',
        background: '#18212f',
      }
    : {
        totalIncoming: { stroke: '#4f46e5', fill: '#c7d2fe' },
        totalOutgoing: { stroke: '#16a34a', fill: '#dcfce7' },
        text: '#374151',
        background: '#fff',
      };

  return (
    <StyledMailingsChart>
      <Heading as='h2'>
        Mailings from {format(allDates.at(0), 'MMM dd yyyy')} &mdash;{' '}
        {format(allDates.at(-1), 'MMM dd yyyy')}
      </Heading>

      <ResponsiveContainer height={300} width='100%'>
        <AreaChart data={data}>
          <XAxis
            dataKey='label'
            tick={{ fill: colors.text }}
            tickLine={{ fill: colors.text }}
          />
          <YAxis
            tick={{ fill: colors.text }}
            tickLine={{ fill: colors.text }}
          />
          <CartesianGrid strokeDasharray='4' />
          <Tooltip contentStyle={{ backgroundColor: colors.background }} />
          <Area
            dataKey='totalIncoming'
            type='monotone'
            stroke={colors.totalIncoming.stroke}
            fill={colors.totalIncoming.fill}
            strokeWidth={2}
            name='Total Incoming'
          />
          <Area
            dataKey='totalOutgoing'
            type='monotone'
            stroke={colors.totalOutgoing.stroke}
            fill={colors.totalOutgoing.fill}
            strokeWidth={2}
            name='Total Outgoing'
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledMailingsChart>
  );
}

export default MailingsChart;
