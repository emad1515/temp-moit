import Button from '../../ui/Button';
import CreateMailForm from './CreateMailForm';
import Modal from '../../ui/Modal';

function AddMailing() {
  return (
    <div>
      <Modal>
        <Modal.Open opens='mail-form'>
          <Button>Add new mail</Button>
        </Modal.Open>
        <Modal.Window name='mail-form'>
          <CreateMailForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddMailing;
