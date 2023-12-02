import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getDocuments } from '../../services/apiDocuments';
import { PAGE_SIZE } from '../../utils/constants';

export function useDocuments() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // SEARCH
  const search = searchParams.get('search') || '';

  // FILTER
  const type = searchParams.get('type') || 'all';
  const year = searchParams.get('year') || new Date().getFullYear();
  const month = searchParams.get('month') || 'all';

  // SORT
  const sortBy = searchParams.get('sortBy') || '-createdAt';

  // PAGINATION
  const page = Number(searchParams.get('page')) || 1;

  // QUERY
  const {
    isLoading,
    data: { data: documents, results } = {},
    error,
  } = useQuery({
    queryKey: ['documents', search, sortBy, page, type, year, month],
    queryFn: () =>
      getDocuments({
        search,
        sortBy,
        page,
        type,
        year,
        month,
      }),
  });

  // PRE=FETCHING
  const pageCount = Math.ceil(results / PAGE_SIZE);

  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ['documents', search, sortBy, page + 1, type, year, month],
      queryFn: () =>
        getDocuments({
          search,
          sortBy,
          page: page + 1,
          type,
          year,
          month,
        }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ['documents', search, sortBy, page - 1, type, year, month],
      queryFn: () =>
        getDocuments({
          search,
          sortBy,
          page: page - 1,
          type,
          year,
          month,
        }),
    });

  return { isLoading, error, documents, results };
}
