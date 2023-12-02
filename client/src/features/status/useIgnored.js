import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateMailing } from '../../services/apiMailings';

export function useIgnored() {
  const queryClient = useQueryClient();

  const { mutate: ignored, isLoading: isIgnoring } = useMutation({
    mutationFn: mailingId =>
      updateMailing(mailingId, {
        status: 'ignored',
      }),

    onSuccess: data => {
      toast.success(`Mail #${data.data.data.refNum} successfully ignoring`);
      queryClient.invalidateQueries({ active: true });
    },

    onError: () => toast.error('There was an error while ignoring'),
  });

  return { ignored, isIgnoring };
}
