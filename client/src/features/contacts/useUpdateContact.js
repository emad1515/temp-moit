import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { createUpdateContact as createUpdateContactApi } from '../../services/apiContact';

export function useUpdateContact() {
  const queryClient = useQueryClient();

  const { mutate: updateContact, isLoading: isUpdating } = useMutation({
    mutationFn: ({ newContactData, id }) =>
      createUpdateContactApi(newContactData, id),
    onSuccess: () => {
      toast.success('Contact successfully Updated');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: err => toast.error(err.message),
  });

  return { isUpdating, updateContact };
}
