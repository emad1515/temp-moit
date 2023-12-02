import { useQuery } from '@tanstack/react-query';
import { subDays } from 'date-fns';
import { useSearchParams } from 'react-router-dom';

import { getProcessingAfterDate } from '../../services/apiMailings';

export function useRecentProcessing() {
  const [searchParams] = useSearchParams();

  const numDays = !searchParams.get('last')
    ? 7
    : Number(searchParams.get('last'));
  const queryDate = subDays(new Date(), numDays).toISOString();

  const { isLoading, data: processing } = useQuery({
    queryFn: () => getProcessingAfterDate(queryDate),
    queryKey: ['processing', `last-${numDays}`],
  });

  const startedProcessing = processing?.filter(
    mail => mail.status === 'processing' || mail.status === 'implemented'
  );

  return { isLoading, processing, startedProcessing };
}
