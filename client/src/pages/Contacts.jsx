import ContactTable from '../features/contacts/ContactTable';
import Heading from '../ui/Heading';
import Row from '../ui/Row';
import AddContact from '../features/contacts/AddContact';
import ContactTableOperations from '../features/contacts/ContactTableOperations';

function Contacts() {
  return (
    <>
      <Row type='horizontal'>
        <Heading as='h1'>All contacts</Heading>
        <ContactTableOperations />
      </Row>
      <Row>
        <ContactTable />

        <AddContact />
      </Row>
    </>
  );
}

export default Contacts;
