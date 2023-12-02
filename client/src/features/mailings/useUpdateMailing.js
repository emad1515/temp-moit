import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { CreateMailing } from '../../services/apiMailings';

export function useUpdateMailing() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: updateMail, isLoading: isUpdating } = useMutation({
    mutationFn: ({ newMailData, id }) => CreateMailing(newMailData, id),
    onSuccess: () => {
      toast.success('Mail successfully updated');
      queryClient.invalidateQueries({ queryKey: ['mailings'] });
      navigate('/mailings');
    },
    onError: err => toast.error(err.message),
  });

  return { isUpdating, updateMail };
}
