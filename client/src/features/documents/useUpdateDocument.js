import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { createDocument } from '../../services/apiDocuments';

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: updateDocument, isLoading: isUpdating } = useMutation({
    mutationFn: ({ newMailData, id }) => createDocument(newMailData, id),
    onSuccess: () => {
      toast.success('Document successfully updated');
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      navigate('/documents');
    },
    onError: err => toast.error(err.message),
  });

  return { isUpdating, updateDocument };
}
