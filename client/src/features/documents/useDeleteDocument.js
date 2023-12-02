import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteDocument as deleteDocumentApi } from '../../services/apiDocuments';

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteDocument } = useMutation({
    mutationFn: deleteDocumentApi,
    onSuccess: () => {
      toast.success('Document successfully deleted');
      queryClient.invalidateQueries({
        queryKey: ['documents'],
      });
    },
    onError: err => toast.error(err.message),
  });

  return { isDeleting, deleteDocument };
}
