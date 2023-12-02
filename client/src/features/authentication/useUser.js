import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../../services/apiAuth';

export function useUser() {
  const { isLoading, data } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
  });

  return {
    isLoading,
    data,
    isAdmin: data?.role === 'admin' || data?.data?.role === 'admin',
    isAuthenticated:
      data?.role === 'admin' ||
      data?.data?.role === 'admin' ||
      data?.role === 'supervisor' ||
      data?.data?.role === 'supervisor' ||
      data?.role === 'user' ||
      data?.data?.role === 'user',
  };
}
