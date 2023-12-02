import styled from 'styled-components';
import { HiPencil, HiTrash } from 'react-icons/hi2';

import CreateContactForm from './CreateContactForm';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import { useDeleteContact } from './useDeleteContact';

const JobTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-grey-600);
`;

const Item = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-green-700);
`;

function ContactRow({ contact }) {
  const { isDeleting, deleteContact } = useDeleteContact();
  const { _id: contactId, jobTitle, name, email, phone } = contact;

  return (
    <Table.Row>
      <JobTitle>{jobTitle}</JobTitle>
      {name ? <Item>{name}</Item> : <span>&mdash;</span>}
      {email ? <Item>{email}</Item> : <span>&mdash;</span>}
      {phone ? <Item>{phone}</Item> : <span>&mdash;</span>}

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={contactId} />

            <Menus.List id={contactId}>
              <Modal.Open opens='update'>
                <Menus.Button icon={<HiPencil />}>Update</Menus.Button>
              </Modal.Open>

              <Modal.Open opens='delete'>
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name='update'>
              <CreateContactForm contactToEdit={contact} />
            </Modal.Window>

            <Modal.Window name='delete'>
              <ConfirmDelete
                resourceName='contact'
                disabled={isDeleting}
                onConfirm={() => {
                  deleteContact(contactId);
                }}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default ContactRow;
