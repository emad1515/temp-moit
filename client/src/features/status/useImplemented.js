import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateMailing } from '../../services/apiMailings';

export function useImplemented() {
  const queryClient = useQueryClient();

  const { mutate: implemented, isLoading: isImplementing } = useMutation({
    mutationFn: mailingId =>
      updateMailing(mailingId, {
        status: 'implemented',
      }),

    onSuccess: data => {
      toast.success(`Mail #${data.data.data.refNum} successfully implementing`);
      queryClient.invalidateQueries({ active: true });
    },

    onError: () => toast.error('There was an error while implementing'),
  });

  return { implemented, isImplementing };
}
