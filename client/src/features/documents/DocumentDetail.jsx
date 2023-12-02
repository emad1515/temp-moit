import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import DocumentDataBox from './DocumentDataBox';
import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';
import Spinner from '../../ui/Spinner';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Empty from '../../ui/Empty';
import { useMoveBack } from '../../hooks/useMoveBack';

import { useDeleteDocument } from './useDeleteDocument';
import { useDocument } from './useDocument';

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function DocumentDetail() {
  const { document, isLoading } = useDocument();
  const { deleteDocument, isDeleting } = useDeleteDocument();

  const moveBack = useMoveBack();
  const navigate = useNavigate();

  if (isLoading) return <Spinner />;
  if (!document) return <Empty resourceName='document' />;

  const { _id: documentId } = document;

  return (
    <>
      <Row type='horizontal'>
        <HeadingGroup>
          <Heading as='h1'>Document</Heading>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <DocumentDataBox document={document} />

      <ButtonGroup>
        <Modal>
          <Modal.Open opens='delete'>
            <Button variation='danger'>Delete Document</Button>
          </Modal.Open>
          <Modal.Window name='delete'>
            <ConfirmDelete
              resourceName='Document'
              disabled={isDeleting}
              onConfirm={() => {
                deleteDocument(documentId, {
                  onSettled: () => navigate(-1),
                });
              }}
            />
          </Modal.Window>
        </Modal>

        <Button variation='secondary' onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default DocumentDetail;
