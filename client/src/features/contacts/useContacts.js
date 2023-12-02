import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getContacts } from '../../services/apiContact';
import { PAGE_SIZE } from '../../utils/constants';

export function useContacts() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // SEARCH;
  const search = searchParams.get('search') || '';

  // FILTER
  const filter = searchParams.get('email') || '';

  // SORT
  const sortBy = searchParams.get('sortBy') || '-createdAt';

  // PAGINATION
  const page = Number(searchParams.get('page')) || 1;

  const {
    isLoading,
    data: { data: contacts, results } = {},
    error,
  } = useQuery({
    queryKey: ['contacts', search, filter, sortBy, page],
    queryFn: () => getContacts({ search, filter, sortBy, page }),
  });

  // PRE=FETCHING
  const pageCount = Math.ceil(results / PAGE_SIZE);

  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ['contacts', search, filter, sortBy, page + 1],
      queryFn: () => getContacts({ search, filter, sortBy, page: page + 1 }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ['contacts', search, filter, sortBy, page - 1],
      queryFn: () => getContacts({ search, filter, sortBy, page: page - 1 }),
    });

  // contacts = contacts?.data?.data;

  return { isLoading, error, contacts, results };
}
