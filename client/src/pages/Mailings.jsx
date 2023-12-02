import AddMailing from '../features/mailings/AddMailing';
import MailingTable from '../features/mailings/MailingTable';
import MailingTableOperations from '../features/mailings/MailingTableOperations';
import Filter from '../ui/Filter';
import Heading from '../ui/Heading';
import Row from '../ui/Row';
import SortBy from '../ui/SortBy';
import TableOperations from '../ui/TableOperations';

function mailings() {
  return (
    <>
      <Row type='horizontal'>
        <Heading as='h1'>All mailings</Heading>
        <TableOperations>
          <Filter
            filterField='status'
            options={[
              { value: 'all', label: 'All' },
              { value: 'pending', label: 'Pending' },
              { value: 'processing', label: 'Processing' },
              { value: 'implemented', label: 'Implemented' },
              { value: 'ignored', label: 'Ignored' },
            ]}
          />

          <SortBy
            options={[
              { value: '-createdAt', label: 'Sort by date (recent first)' },
              { value: 'createdAt', label: 'Sort by date (earlier first)' },

              { value: '-endDate', label: 'Sort by End Date (recent first)' },
              { value: 'endDate', label: 'Sort by End Date (earlier first)' },
            ]}
          />
        </TableOperations>
      </Row>
      <Row type='horizontal'>
        <MailingTableOperations />
      </Row>

      <MailingTable />
      <AddMailing />
    </>
  );
}

export default mailings;
