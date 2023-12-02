import DocumentTableOperations from '../features/documents/DocumentTableOperations';
import DocumentTable from '../features/documents/DocumentTable';
import AddDocument from '../features/documents/AddDocument';

import Heading from '../ui/Heading';
import Row from '../ui/Row';

function Documents() {
  return (
    <>
      <Row type='horizontal'>
        <Heading as='h1'>All documents</Heading>
        <DocumentTableOperations />
      </Row>

      <DocumentTable />
      <AddDocument />
    </>
  );
}

export default Documents;
