import styled from 'styled-components';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiXMark } from 'react-icons/hi2';

const SearchClose = styled.button`
  position: relative;
  background: none;
  border: none;
  padding: 0.7rem;
  border-radius: var(--border-radius-sm);
  top: 0;
  right: 0;
  transform: translateX(-170%);

  &:hover {
    background-color: var(--color-grey-100);
  }

  &:focus {
    outline: none;
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-500);
  }
`;

const SearchInput = styled.input`
  width: 50rem;
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
`;

function Search() {
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  function handleSubmit(e) {
    e.preventDefault();
    if (searchParams.get('page')) searchParams.set('page', 1);

    searchParams.set('search', search);
    setSearchParams(searchParams);
  }

  function handleClose(e) {
    e.preventDefault();
    if (searchParams.get('page')) searchParams.set('page', 1);

    searchParams.set('search', '');
    setSearchParams(searchParams);
    setSearch('');
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <SearchInput
          type='text'
          placeholder='Search...'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </form>

      <SearchClose onClick={handleClose}>
        <HiXMark />
      </SearchClose>
    </>
  );
}
export default Search;
