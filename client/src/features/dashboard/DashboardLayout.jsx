import styled from 'styled-components';

import Stats from './Stats';
import Spinner from '../../ui/Spinner';
import MailingsChart from './MailingsChart';
import ResponseDaysChart from './responseDaysChart';
import TodayActivity from '../status/TodayActivity';
import { useRecentMailings } from './useRecentMailings';
import { useRecentProcessing } from './useRecentProcessing';

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const {
    mailings,
    outgoingMailings,
    incomingMailings,
    isLoading: isLoading1,
    numDays,
  } = useRecentMailings();

  const { startedProcessing, isLoading: isLoading2 } = useRecentProcessing();

  if (isLoading1 || isLoading2) return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Stats
        mailings={mailings}
        startedProcessing={startedProcessing}
        outgoingMailings={outgoingMailings}
        incomingMailings={incomingMailings}
      />
      <TodayActivity />
      <ResponseDaysChart startedProcessing={startedProcessing} />
      <MailingsChart mailings={mailings} numDays={numDays} />
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
