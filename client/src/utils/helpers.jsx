import { format, formatDistance, parseISO } from 'date-fns';
import { differenceInDays } from 'date-fns/esm';
import {
  HiOutlineArrowUpRight,
  HiOutlineBuildingLibrary,
  HiOutlineCog,
  HiOutlineDocumentText,
  HiOutlineEnvelope,
  HiOutlineHome,
  HiOutlineLockClosed,
  HiOutlineUserGroup,
} from 'react-icons/hi2';

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = dateStr =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace('about ', '')
    .replace('in', 'In');

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const formatDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), new Date(date));

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return format(new Date(date), 'MMM dd yyyy p');
  }
};

export const toISOStringWithTimezone = date => {
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? '+' : '-';
  const pad = n => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds()) +
    diff +
    pad(tzOffset / 60) +
    ':' +
    pad(tzOffset % 60)
  );
};

export const calcDaysPassed = (date1, date2) => {
  return Math.round(
    Math.abs((new Date(date1) - new Date(date2)) / (1000 * 60 * 60 * 24))
  );
};

export const getIcon = function (type) {
  // Mailings type
  if (type === 'outgoing') return <HiOutlineArrowUpRight size={15} />;
  if (type === 'incoming') return <HiOutlineEnvelope size={15} />;
  if (type === 'localOutgoing')
    return (
      <span>
        {' '}
        <HiOutlineHome size={15} /> <HiOutlineArrowUpRight size={15} />
      </span>
    );
  if (type === 'localIncoming')
    return (
      <>
        <HiOutlineHome size={15} /> <HiOutlineEnvelope size={15} />
      </>
    );
  if (type === 'private') return <HiOutlineLockClosed size={15} />;

  // Documents type
  if (type === 'file') return <HiOutlineDocumentText size={15} />;
  if (type === 'Ministerial Decision')
    return <HiOutlineBuildingLibrary size={15} />;
  if (type === 'Administrative Circular') return <HiOutlineCog size={15} />;
  if (type === 'MOM') return <HiOutlineUserGroup size={15} />;
};

export const styleRefNum = function (type, refNum) {
  if (type === 'outgoing') {
    const strNum = refNum?.toString();
    const year = strNum?.slice(0, 2);
    const num = Number(strNum?.slice(-5));
    const styleRef = [year, num].join('-');
    return styleRef;
  }

  if (type === 'incoming') {
    const strNum = refNum?.toString();
    const year = strNum?.slice(0, 2);
    const rank = strNum?.slice(2, -5);
    const num = Number(strNum?.slice(-5));
    const styleRef = [year, rank, num].join('-');
    return styleRef;
  }

  if (type === 'localOutgoing') {
    const strNum = refNum?.toString();
    const year = strNum?.slice(0, 4);
    const num = Number(strNum?.slice(5));
    const styleRef = [year, num].join('-');
    return styleRef;
  }

  if (type === 'localIncoming') {
    const strNum = refNum?.toString();
    const year = strNum?.slice(0, 4);
    const rank = strNum?.slice(4, -5);
    const num = Number(strNum?.slice(-5));
    const styleRef = [year, rank, num].join('-');
    return styleRef;
  }

  if (type === 'private') {
    const strNum = refNum?.toString();
    const year = strNum?.slice(0, 4);
    const num = Number(strNum?.slice(4));
    const styleRef = [year, num].join('-');
    return styleRef;
  }
};

export const getIdContact = function (array, name) {
  return array?.find(contact => contact.jobTitle === name)?._id;
};
