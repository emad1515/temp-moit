import { useSearchParams } from 'react-router-dom';

import Select from './Select';

function FilterByMonth({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const month = searchParams.get('month') || '';

  function handleChange(e) {
    searchParams.set('month', e.target.value);
    setSearchParams(searchParams);
  }

  return (
    <Select
      options={options}
      type='white'
      value={month}
      onChange={handleChange}
    />
  );
}

export default FilterByMonth;
