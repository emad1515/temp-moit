/* eslint-disable no-dupe-keys */
import { lastDayOfMonth } from 'date-fns';

import customFetch from '../utils/customFetch';
import { getToday } from '../utils/helpers';
import { FIELDS, PAGE_SIZE } from '../utils/constants';

export async function getDocuments({
  search,
  sortBy,
  page,
  type,
  year,
  month,
}) {
  const queryObject = {
    search,
    sort: sortBy,
    page,
    limit: `${PAGE_SIZE}`,
    // fields: FIELDS.join(','),
  };

  // FILTER
  if (type !== 'all') queryObject.type = type;
  if (year !== 'all' && month === 'all') {
    queryObject['createdAt[lte]'] = `${year}/12/31`;
    queryObject['createdAt[gte]'] = `${year}/1/1`;
  }
  if (year !== 'all' && month !== 'all') {
    queryObject['createdAt[lte]'] = lastDayOfMonth(
      new Date(`${year}`, `${Number(month) - 1}`)
    );
    queryObject['createdAt[gte]'] = new Date(`${year}`, `${Number(month) - 1}`);
  }

  // create URL string for fetching data
  const queryStr = Object.entries(queryObject)
    .map(el => el.join('='))
    .join('&');

  // Fetching data
  const {
    data: {
      results,
      data: { data: data },
    },
    error,
  } = await customFetch.get(`/files?${queryStr}`);

  if (error) {
    console.error(error);
    throw new Error('Documents could not be loaded');
  }

  return { data, results };
}

export async function getDocument(id) {
  const { data, error } = await customFetch.get(`/files/${id}`);

  if (error) {
    throw new Error('Document not found');
  }

  return data;
}

// Returns all Mailings that are were created after the given date. Useful to get Mailings created in the last 30 days, for example.
export async function getMailingsAfterDate(date) {
  const queryObject = {
    'createdAt[gte]': date,
    'createdAt[lte]': getToday({ end: true }),
    'type[ne]': 'file',
    fields: FIELDS.join(','),
  };

  const queryStr = Object.entries(queryObject)
    .map(el => el.join('='))
    .join('&');

  const {
    data: {
      data: { data: data },
    },
    error,
  } = await customFetch(`/documents?${queryStr}`);

  if (error) {
    console.error(error);
    throw new Error('Mailings could not get loaded');
  }

  return data;
}

// Returns all Processing Mails that are were created after the given date
export async function getProcessingAfterDate(date) {
  const queryObject = {
    'startDate[gte]': date,
    'startDate[lte]': getToday({ end: true }),
    'type[ne]': 'file',
    fields: FIELDS.join(','),
  };

  const queryStr = Object.entries(queryObject)
    .map(el => el.join('='))
    .join('&');

  const {
    data: {
      data: { data: data },
    },
    error,
  } = await customFetch(`/documents?${queryStr}`);

  if (error) {
    console.error(error);
    throw new Error('Mailings could not get loaded');
  }

  return data;
}

// Activity means that there is a respone doc today
export async function getMailingsTodayActivity() {
  const {
    data: {
      data: { data: data },
    },
    error,
  } = await customFetch(
    `/documents?fields=${FIELDS}&todayActivity=true&start=${getToday()}&end=${getToday(
      {
        end: true,
      }
    )}`
  );

  if (error) {
    console.error(error);
    throw new Error('Mailings could not get loaded');
  }

  console.log(data);
  return data;
}

export async function createDocument(newMail, id) {
  let query;
  let form;

  if (newMail?.file === undefined) delete newMail.file;
  if (typeof newMail?.tags?.at(0) !== 'string') delete newMail.listOfCc;

  form = new FormData();
  Object.entries(newMail).forEach(el => {
    if (el[0] === 'tags') {
      el[1].forEach(tag => form.append('tags', tag));
    } else form.append(el[0], el[1]);
  });

  // A) CREATE
  if (!id) query = customFetch.post('/files', form);

  // B) UPDATE
  if (id) query = customFetch.patch(`/files/${id}`, form);

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error('Document could not be created');
  }

  return data;
}

// Simple update for implemented status
export async function updateMailing(id, obj) {
  const { data, error } = await customFetch.patch(`/documents/${id}`, obj);

  if (error) {
    console.error(error);
    throw new Error('Mailings could not be updated');
  }

  return data;
}

export async function deleteDocument(id) {
  const { data, error } = await customFetch.delete(`/files/${id}`);

  if (error) {
    console.error(error);
    throw new Error('Document could not be deleted');
  }
  return data;
}
