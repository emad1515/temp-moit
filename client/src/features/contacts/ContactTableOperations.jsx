import TableOperations from '../../ui/TableOperations';
import Filter from '../../ui/Filter';
import SortBy from '../../ui/SortBy';

function ContactTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField='email'
        options={[
          { value: 'all', label: 'All' },
          { value: 'with-email', label: 'With email' },
          { value: 'no-email', label: 'No email' },
        ]}
      />
      <SortBy
        options={[
          { value: '-createdAt', label: 'Sort by date (recent first)' },
          { value: 'createdAt', label: 'Sort by date (earlier first)' },

          { value: 'jobTitle', label: 'Sort by job title (A-Z)' },
          { value: '-jobTitle', label: 'Sort by job title (Z-A)' },
        ]}
      />
    </TableOperations>
  );
}

export default ContactTableOperations;
