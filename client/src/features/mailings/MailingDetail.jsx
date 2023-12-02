import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCheckCircle } from 'react-icons/hi2';

import MailingDataBox from './MailingDataBox';
import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import Tag from '../../ui/Tag';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';
import Spinner from '../../ui/Spinner';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Empty from '../../ui/Empty';
import { useMoveBack } from '../../hooks/useMoveBack';
import { useMailing } from './useMailing';
import { useImplemented } from '../status/useImplemented';
import { useDeleteMailing } from './useDeleteMailing';
import { styleRefNum } from '../../utils/helpers';

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function MailingDetail() {
  const { mailing, isLoading } = useMailing();
  const { implemented, isImplementing } = useImplemented();
  const { deleteMailing, isDeleting } = useDeleteMailing();

  const moveBack = useMoveBack();
  const navigate = useNavigate();

  if (isLoading) return <Spinner />;
  if (!mailing) return <Empty resourceName='mailing' />;

  const { _id: mailingId, status, type, refNum } = mailing;

  const statusToTagName = {
    pending: 'blue',
    processing: 'green',
    implemented: 'silver',
    ignored: 'red',
  };

  return (
    <>
      <Row type='horizontal'>
        <HeadingGroup>
          <Heading as='h1'>Mailing #{styleRefNum(type, refNum)}</Heading>
          <Tag type={statusToTagName[status]}>{status}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <MailingDataBox mailing={mailing} />

      <ButtonGroup>
        {status === 'pending' && (
          <Button onClick={() => navigate(`/processing/${mailingId}`)}>
            Processing
          </Button>
        )}

        {status === 'processing' && (
          <Button
            icon={<HiOutlineCheckCircle />}
            onClick={() => implemented(mailingId)}
            disabled={isImplementing}
          >
            Implemented
          </Button>
        )}

        <Modal>
          <Modal.Open opens='delete'>
            <Button variation='danger'>Delete Mailing</Button>
          </Modal.Open>
          <Modal.Window name='delete'>
            <ConfirmDelete
              resourceName='mailing'
              disabled={isDeleting}
              onConfirm={() => {
                deleteMailing(mailingId, {
                  onSettled: () => navigate(-1),
                });
              }}
            />
          </Modal.Window>
        </Modal>

        <Button variation='secondary' onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default MailingDetail;
