import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { createUpdateContact } from '../../services/apiContact';

export function useCreateContact() {
  const queryClient = useQueryClient();

  const { mutate: createContact, isLoading: isCreating } = useMutation({
    mutationFn: createUpdateContact,
    onSuccess: () => {
      toast.success('New contact successfully created');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: err => toast.error(err.message),
  });

  return { isCreating, createContact };
}
