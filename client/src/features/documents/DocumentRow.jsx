import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi2';

import Tag from '../../ui/Tag';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import CreateDocumentForm from './CreateDocumentForm';
import { formatDate, getIcon } from '../../utils/helpers';
import { useDeleteDocument } from './useDeleteDocument';

const Item = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-600);
`;

const ItemDate = styled.div`
  font-size: 1.2rem;
  font-weight: 400;
  color: var(--color-grey-500);
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
`;

function DocumentRow({ document }) {
  const { _id: documentId, createdAt, subject, type, tags } = document;

  const navigate = useNavigate();
  const { deleteDocument, isDeleting } = useDeleteDocument();

  return (
    <>
      <Table.Row>
        <Item>{subject}</Item>
        <Item>{getIcon(type)}</Item>
        <ItemDate>{formatDate(createdAt)}</ItemDate>
        <Tags>
          {tags.map((tag, i) => (
            <Tag type='indigo' key={i}>
              {tag}
            </Tag>
          ))}
        </Tags>

        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={documentId} />
            <Menus.List id={documentId}>
              <Menus.Button
                icon={<HiEye />}
                onClick={() => navigate(`/documents/${documentId}`)}
              >
                See details
              </Menus.Button>

              <Modal.Open opens='update'>
                <Menus.Button icon={<HiPencil />}>Update</Menus.Button>
              </Modal.Open>

              <Modal.Open opens='delete'>
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>

          <Modal.Window name='update'>
            <CreateDocumentForm mailToUpdate={document} />
          </Modal.Window>

          <Modal.Window name='delete'>
            <ConfirmDelete
              resourceName='mailing'
              disabled={isDeleting}
              onConfirm={() => {
                deleteDocument(documentId);
              }}
            />
          </Modal.Window>
        </Modal>
      </Table.Row>
    </>
  );
}

export default DocumentRow;
