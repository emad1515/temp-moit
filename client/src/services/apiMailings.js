/* eslint-disable no-dupe-keys */
import { lastDayOfMonth } from 'date-fns';

import customFetch from '../utils/customFetch';
import { getToday } from '../utils/helpers';
import { FIELDS, PAGE_SIZE } from '../utils/constants';

export async function getMailings({
  search,
  filter,
  sortBy,
  page,
  department,
  type,
  year,
  month,
  refNum,
}) {
  const queryObject = {
    search,
    sort: sortBy,
    page,
    limit: `${PAGE_SIZE}`,
    fields: FIELDS.join(','),
  };

  // FILTER
  if (filter !== 'all') queryObject.status = filter;
  if (type !== 'all') queryObject.type = type;
  if (department !== 'all') queryObject.department = department;
  if (refNum !== 'all') queryObject.refNum = refNum;
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
  } = await customFetch.get(`/documents?${queryStr}`);

  if (error) {
    console.error(error);
    throw new Error('Mailings could not be loaded');
  }

  return { data, results };
}

export async function getMailing(id) {
  const { data, error } = await customFetch.get(`/documents/${id}`);

  if (error) {
    throw new Error('Mailing not found');
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

  return data;
}

export async function CreateMailing(newMail, id) {
  let query;
  let form;

  if (newMail?.file === undefined) delete newMail.file;
  if (newMail?.instructionsFile === undefined) delete newMail.instructionsFile;
  if (newMail?.receiptLocal === undefined) delete newMail.receiptLocal;
  if (newMail?.receiptExternal === undefined) delete newMail.receiptExternal;
  if (typeof newMail?.listOfCc?.at(0) !== 'string') delete newMail.listOfCc;

  form = new FormData();
  Object.entries(newMail).forEach(el => {
    if (el[0] === 'listOfCc') {
      el[1].forEach(id => form.append('listOfCc', id));
    } else form.append(el[0], el[1]);
  });

  // A) CREATE
  if (!id) query = customFetch.post('/documents', form);

  // B) UPDATE
  if (id) query = customFetch.patch(`/documents/${id}`, form);

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error('Mailing could not be created');
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

export async function deleteMailing(id) {
  const { data, error } = await customFetch.delete(`/documents/${id}`);

  if (error) {
    console.error(error);
    throw new Error('Mailing could not be deleted');
  }
  return data;
}
