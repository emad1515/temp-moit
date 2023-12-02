import TableOperations from '../../ui/TableOperations';

import Filter from '../../ui/Filter';
import SortBy from '../../ui/SortBy';
import FilterYear from '../../ui/FilterYear';
import FilterByMonth from '../../ui/FilterByMonth';

function DocumentTableOperations() {
  return (
    <TableOperations>
      <TableOperations>
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

        <Filter
          filterField='type'
          options={[
            { value: 'all', label: 'All' },
            { value: 'file', label: 'file' },
            { value: 'Ministerial Decision', label: 'Ministerial Decision' },
            {
              value: 'Administrative Circular',
              label: 'Administrative circular',
            },
            { value: 'MOM', label: 'MOM' },
          ]}
        />

        <SortBy
          options={[
            { value: '-createdAt', label: 'Sort by date (recent first)' },
            { value: 'createdAt', label: 'Sort by date (earlier first)' },
          ]}
        />
      </TableOperations>
    </TableOperations>
  );
}

export default DocumentTableOperations;
