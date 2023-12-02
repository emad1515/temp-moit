import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteMailing as deleteMailingApi } from '../../services/apiMailings';

export function useDeleteMailing() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteMailing } = useMutation({
    mutationFn: deleteMailingApi,
    onSuccess: () => {
      toast.success('Mailing successfully deleted');
      queryClient.invalidateQueries({
        queryKey: ['mailings'],
      });
    },
    onError: err => toast.error(err.message),
  });

  return { isDeleting, deleteMailing };
}
