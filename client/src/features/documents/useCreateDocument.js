import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { createDocument as createDocumentApi } from '../../services/apiDocuments';

export function useCreateDocument() {
  const queryClient = useQueryClient();

  const { mutate: createDocument, isLoading: isCreating } = useMutation({
    mutationFn: createDocumentApi,
    onSuccess: () => {
      toast.success('new Document successfully created');
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: err => toast.error(err.message),
  });

  return { isCreating, createDocument };
}
