import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getMailings } from '../../services/apiMailings';
import { PAGE_SIZE } from '../../utils/constants';
import { useAllContacts } from '../contacts/useAllContacts';
import { getIdContact } from '../../utils/helpers';

export function useMailings() {
  const { contacts: contactsApi } = useAllContacts();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // SEARCH
  const search = searchParams.get('search') || '';

  // FILTER
  const filter = searchParams.get('status') || 'all';
  const type = searchParams.get('type') || 'all';
  const year = searchParams.get('year') || new Date().getFullYear();
  const month = searchParams.get('month') || 'all';
  const refNum = searchParams.get('refNum') || 'all';

  const department = searchParams.get('department')
    ? getIdContact(contactsApi, searchParams.get('department'))
    : 'all';

  // SORT
  const sortBy = searchParams.get('sortBy') || '-createdAt';

  // PAGINATION
  const page = Number(searchParams.get('page')) || 1;

  // QUERY
  const {
    isLoading,
    data: { data: mailings, results } = {},
    error,
  } = useQuery({
    queryKey: [
      'mailings',
      search,
      filter,
      sortBy,
      page,
      department,
      type,
      year,
      month,
      refNum,
    ],
    queryFn: () =>
      getMailings({
        search,
        filter,
        sortBy,
        page,
        department,
        type,
        year,
        month,
        refNum,
      }),
  });

  // PRE=FETCHING
  const pageCount = Math.ceil(results / PAGE_SIZE);

  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: [
        'mailings',
        search,
        filter,
        sortBy,
        page + 1,
        department,
        type,
        year,
        month,
        refNum,
      ],
      queryFn: () =>
        getMailings({
          search,
          filter,
          sortBy,
          page: page + 1,
          department,
          type,
          year,
          month,
          refNum,
        }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: [
        'mailings',
        search,
        filter,
        sortBy,
        page - 1,
        department,
        type,
        year,
        month,
        refNum,
      ],
      queryFn: () =>
        getMailings({
          search,
          filter,
          sortBy,
          page: page - 1,
          department,
          type,
          year,
          month,
          refNum,
        }),
    });

  // mailings = mailings?.data;

  return { isLoading, error, mailings, results };
}

// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { useSearchParams } from 'react-router-dom';

// import { getMailings } from '../../services/apiMailings';
// import { PAGE_SIZE } from '../../utils/constants';

// export function useMailings() {
//   const queryClient = useQueryClient();
//   const [searchParams] = useSearchParams();

//   // SEARCH
//   const searchValue = searchParams.get('search');
//   const search = !searchValue ? null : { field: 'subject', value: searchValue };

//   // FILTER
//   const filterValue = searchParams.get('status');
//   const filter =
//     !filterValue || filterValue === 'all'
//       ? null
//       : { field: 'status', value: filterValue };

//   // SORT
//   const sortByRaw = searchParams.get('sortBy') || 'created_at-desc';
//   const [field, direction] = sortByRaw.split('-');
//   const sortBy = { field, direction };

//   // PAGINATION
//   const page = !searchParams.get('page') ? 1 : Number(searchParams.get('page'));

//   // QUERY
//   const {
//     isLoading,
//     data: { data: mailings, count } = {},
//     error,
//   } = useQuery({
//     queryKey: ['mailings', search, filter, sortBy, page],
//     queryFn: () => getMailings({ search, filter, sortBy, page }),
//   });

//   // PRE=FETCHING
//   const pageCount = Math.ceil(count / PAGE_SIZE);

//   if (page < pageCount)
//     queryClient.prefetchQuery({
//       queryKey: ['mailings', search, filter, sortBy, page + 1],
//       queryFn: () => getMailings({ search, filter, sortBy, page: page + 1 }),
//     });

//   if (page > 1)
//     queryClient.prefetchQuery({
//       queryKey: ['mailings', search, filter, sortBy, page - 1],
//       queryFn: () => getMailings({ search, filter, sortBy, page: page - 1 }),
//     });

//   return { isLoading, error, mailings, count };
// }
