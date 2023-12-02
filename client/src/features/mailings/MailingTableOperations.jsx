import TableOperations from '../../ui/TableOperations';
import Department from '../../ui/Department';
import { DEPARTMENTS, DOCUMENTS_TYPE } from '../../utils/constants';
import DocumentType from '../../ui/DocumentType';
import FilterYear from '../../ui/FilterYear';
import FilterByMonth from '../../ui/FilterByMonth';
import SearchByRefNum from '../../ui/SearchByRefNum';

function MailingTableOperations() {
  return (
    <TableOperations>
      <Department
        options={[{ value: '', label: 'All Departments' }, ...DEPARTMENTS]}
      />
      <DocumentType
        options={[
          { value: '', label: 'All Documents Type' },
          ...DOCUMENTS_TYPE,
        ]}
      />
      <FilterYear
        filterField='year'
        options={[
          { value: 'all', label: 'All' },
          {
            value: String(new Date().getFullYear()),
            label: new Date().getFullYear(),
          },
          {
            value: String(new Date().getFullYear() - 1),
            label: new Date().getFullYear() - 1,
          },
        ]}
      />
      <FilterByMonth
        options={[
          { value: 'all', label: 'All Months' },
          { value: '1', label: 'January' },
          { value: '2', label: 'February' },
          { value: '3', label: 'March' },
          { value: '4', label: 'April' },
          { value: '5', label: 'May' },
          { value: '6', label: 'June' },
          { value: '7', label: 'July' },
          { value: '8', label: 'August' },
          { value: '9', label: 'September' },
          { value: '10', label: 'October' },
          { value: '11', label: 'November' },
          { value: '12', label: 'December' },
        ]}
      />
      <SearchByRefNum />
    </TableOperations>
  );
}

export default MailingTableOperations;
