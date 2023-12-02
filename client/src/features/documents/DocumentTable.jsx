import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import Empty from '../../ui/Empty';
import Spinner from '../../ui/Spinner';
import Pagination from '../../ui/Pagination';

import DocumentRow from './DocumentRow';
import { useDocuments } from './useDocuments';

function DocumentTable() {
  const { documents, isLoading, results } = useDocuments();

  if (isLoading) return <Spinner />;

  if (!documents?.length) return <Empty resourceName='files' />;

  return (
    <Menus>
      <Table columns=' 0.8fr 0.4fr 0.5fr 1fr 0.1fr'>
        <Table.Header>
          <div>Subject</div>
          <div>Type</div>
          <div>Dates</div>
          <div>Tags</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={documents}
          render={document => (
            <DocumentRow key={document._id} document={document} />
          )}
        />

        <Table.Footer>
          <Pagination count={results} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default DocumentTable;
