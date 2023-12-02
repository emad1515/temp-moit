import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import MailingRow from './MailingRow';
import Empty from '../../ui/Empty';
import Spinner from '../../ui/Spinner';
import Pagination from '../../ui/Pagination';
import { useMailings } from './useMailings';

function MailingTable() {
  const { mailings, isLoading, results } = useMailings();

  if (isLoading) return <Spinner />;

  if (!mailings?.length) return <Empty resourceName='mailings' />;

  return (
    <Menus>
      <Table columns=' 1.5fr 0.25fr 1.3fr 1fr 0.5fr 0.6fr 0.2fr'>
        <Table.Header>
          <div>Subject</div>
          <div>Type</div>
          <div>From/To</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Ref</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={mailings}
          render={mailing => <MailingRow key={mailing._id} mailing={mailing} />}
        />

        <Table.Footer>
          <Pagination count={results} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default MailingTable;
