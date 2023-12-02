import Spinner from '../../ui/Spinner';
import CreatFormOffice from './CreatFormOffice';
import { useMailing } from '../mailings/useMailing';

function ProcessingMailing() {
  const { mailing, isLoading } = useMailing();

  if (isLoading) return <Spinner />;

  return <CreatFormOffice officeToUpdate={mailing} />;
}

export default ProcessingMailing;
