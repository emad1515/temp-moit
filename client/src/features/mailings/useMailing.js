import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getMailing } from '../../services/apiMailings';

export function useMailing() {
  const { mailingId } = useParams();

  let {
    isLoading,
    data: mailing,

    error,
  } = useQuery({
    queryKey: ['mailing', mailingId],
    queryFn: () => getMailing(mailingId),
    retry: false,
  });

  mailing = mailing?.data?.data;

  return { isLoading, error, mailing };
}
