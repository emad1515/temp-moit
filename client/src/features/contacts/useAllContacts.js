import { useQuery } from '@tanstack/react-query';
import { getAllContacts } from '../../services/apiContact';

export function useAllContacts() {
  const {
    isLoading,
    data: { data: contacts, results } = {},
    error,
  } = useQuery({
    queryKey: ['allContacts'],
    queryFn: getAllContacts,
  });

  return { isLoading, error, contacts, results };
}
