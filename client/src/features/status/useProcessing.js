import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { updateMailing } from '../../services/apiMailings';

export function useProcessing() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: processing, isLoading: isProcessing } = useMutation({
    mutationFn: ({ mailingId, feilds }) =>
      updateMailing(mailingId, {
        status: 'processing',
        isTreating: true,
        ...feilds,
      }),

    onSuccess: data => {
      toast.success(`Mail #${data.data.data.refNum} successfully treating`);
      queryClient.invalidateQueries({ active: true });
      navigate(`/`);
    },

    onError: () => toast.error('There was an error while processing'),
  });

  return { processing, isProcessing };
}
