import { useSearchParams } from 'react-router-dom';

import Select from './Select';

function Department({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const department = searchParams.get('department') || '';

  function handleChange(e) {
    searchParams.set('department', e.target.value);
    setSearchParams(searchParams);
  }

  return (
    <Select
      options={options}
      type='white'
      value={department}
      onChange={handleChange}
    />
  );
}

export default Department;
