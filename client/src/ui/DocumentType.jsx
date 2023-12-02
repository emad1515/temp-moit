import { useSearchParams } from 'react-router-dom';

import Select from './Select';

function DocumentType({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const type = searchParams.get('type') || '';

  function handleChange(e) {
    searchParams.set('type', e.target.value);
    setSearchParams(searchParams);
  }

  return (
    <Select
      options={options}
      type='white'
      value={type}
      onChange={handleChange}
    />
  );
}

export default DocumentType;
