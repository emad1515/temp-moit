import { PAGE_SIZE } from '../utils/constants';
import customFetch from '../utils/customFetch';

export async function getAllContacts() {
  const {
    data: {
      results,
      data: { data: data },
    },
    error,
  } = await customFetch.get('/contacts?sort=jobTitle&fields=jobTitle');

  if (error) {
    console.error(error);

    throw new Error('Contact could not be deleted');
  }

  return { data, results };
}

export async function getContacts({ search, filter, sortBy, page }) {
  const queryObject = {
    sort: sortBy,
    page,
    limit: `${PAGE_SIZE}`,
  };

  // SEARCH
  if (search) queryObject['jobTitle[regex]'] = search;
  // FILTER
  if (filter === 'with-email') {
    queryObject['email[ne]'] = '';
  }
  if (filter === 'no-email') {
    queryObject['email[eq]'] = '';
  }

  // create URL string for fetching data
  const queryStr = Object.entries(queryObject)
    .map(el => el.join('='))
    .join('&');

  // Fetching data
  let {
    data: {
      results,
      data: { data: data },
    },
    error,
  } = await customFetch.get(`/contacts?${queryStr}`);

  if (error) {
    console.error(error);
    throw new Error('Contacts could not be loaded');
  }

  // const results = data?.results;

  return { data, results };
}

export async function createUpdateContact(newContact, id) {
  let query;

  // A) CREATE
  if (!id) query = customFetch.post('/contacts', newContact);

  // B) EDIT
  if (id) query = customFetch.patch(`/contacts/${id}`, newContact);

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error('Contact could not be created');
  }

  return data;
}

export async function deleteContact(id) {
  const { data, error } = await customFetch.delete(`/contacts/${id}`);

  if (error) {
    console.error(error);

    throw new Error('Contact could not be deleted');
  }

  return data;
}
