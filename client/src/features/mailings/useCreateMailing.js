import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { CreateMailing } from '../../services/apiMailings';

export function useCreateMailing() {
  const queryClient = useQueryClient();

  const { mutate: createMail, isLoading: isCreating } = useMutation({
    mutationFn: CreateMailing,
    onSuccess: () => {
      toast.success('new mail successfully created');
      queryClient.invalidateQueries({ queryKey: ['mailings'] });
    },
    onError: err => toast.error(err.message),
  });

  return { isCreating, createMail };
}
