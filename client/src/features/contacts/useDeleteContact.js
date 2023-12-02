import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { deleteContact as deleteContactApi } from '../../services/apiContact';

export function useDeleteContact() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteContact } = useMutation({
    mutationFn: deleteContactApi,
    onSuccess: () => {
      toast.success('Contact successfully deleted');
      queryClient.invalidateQueries({
        queryKey: ['contacts'],
      });
    },
    onError: err => toast.error(err.message),
  });

  return { isDeleting, deleteContact };
}
