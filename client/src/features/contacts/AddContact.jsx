import Button from '../../ui/Button';
import CreateContactForm from './CreateContactForm';
import Modal from '../../ui/Modal';

function AddContact() {
  return (
    <div>
      <Modal>
        <Modal.Open opens='contact-form'>
          <Button>Add new contact</Button>
        </Modal.Open>
        <Modal.Window name='contact-form'>
          <CreateContactForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddContact;
