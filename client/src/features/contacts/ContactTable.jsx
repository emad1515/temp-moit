// import { useSearchParams } from 'react-router-dom';

import Spinner from '../../ui/Spinner';
import ContactRow from './ContactRow';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import Empty from '../../ui/Empty';
import { useContacts } from './useContacts';
import Pagination from '../../ui/Pagination';

function ContactTable() {
  const { isLoading, contacts, results } = useContacts();

  if (isLoading) return <Spinner />;
  if (!contacts?.length) return <Empty resourceName='contacts' />;

  return (
    <Menus>
      <Table columns=' 1.5fr 1.5fr 1.2fr 0.6fr 0.2fr'>
        <Table.Header>
          <div>Job Title</div>
          <div>Name</div>
          <div>Email</div>
          <div>Phone</div>
        </Table.Header>

        <Table.Body
          data={contacts}
          render={contact => <ContactRow contact={contact} key={contact._id} />}
        />

        <Table.Footer>
          <Pagination count={results} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default ContactTable;
