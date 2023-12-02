import Button from '../../ui/Button';
import CreateDocumentForm from './CreateDocumentForm';
import Modal from '../../ui/Modal';

function AddDocument() {
  return (
    <div>
      <Modal>
        <Modal.Open opens='document-form'>
          <Button>Add new document</Button>
        </Modal.Open>
        <Modal.Window name='document-form'>
          <CreateDocumentForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddDocument;
