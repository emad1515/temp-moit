import { useQuery } from '@tanstack/react-query';
import { getMailingsTodayActivity } from '../../services/apiMailings';

export function useTodayActivity() {
  const { isLoading, data: activities } = useQuery({
    queryFn: getMailingsTodayActivity,
    queryKey: ['taday-activity'],
  });

  return { activities, isLoading };
}
