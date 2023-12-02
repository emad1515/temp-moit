import { useQuery } from '@tanstack/react-query';
import { subDays } from 'date-fns';
import { useSearchParams } from 'react-router-dom';

import { getMailingsAfterDate } from '../../services/apiMailings';

export function useRecentMailings() {
  const [searchParams] = useSearchParams();

  const numDays = !searchParams.get('last')
    ? 7
    : Number(searchParams.get('last'));

  const queryDate = subDays(new Date(), numDays).toISOString();

  const { isLoading, data: mailings } = useQuery({
    queryFn: () => getMailingsAfterDate(queryDate),
    queryKey: ['mailings', `last-${numDays}`],
  });

  const outgoingMailings = mailings?.filter(
    mail =>
      mail.type === 'outgoing' ||
      mail.type === 'localOutgoing' ||
      mail.type === 'private'
  );

  const incomingMailings = mailings?.filter(
    mail => mail.type === 'incoming' || mail.type === 'localIncoming'
  );

  return { isLoading, mailings, outgoingMailings, incomingMailings, numDays };
}
