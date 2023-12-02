import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getDocument } from '../../services/apiDocuments';

export function useDocument() {
  const { documentId } = useParams();

  let {
    isLoading,
    data: document,

    error,
  } = useQuery({
    queryKey: ['document', documentId],
    queryFn: () => getDocument(documentId),
    retry: false,
  });

  document = document?.data?.data;

  return { isLoading, error, document };
}
