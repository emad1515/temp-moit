import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { sendEmail as sendEmailApi } from './sendEmail';

export function useSendMailing() {
  const navigate = useNavigate();

  const { isLoading: isSending, mutate: sendEmail } = useMutation({
    mutationFn: sendEmailApi,
    onSuccess: () => {
      navigate(-1);
    },
  });

  return { isSending, sendEmail };
}
