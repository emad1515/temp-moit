import styled from 'styled-components';
import { formatDistance } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  HiEye,
  HiOutlineArchiveBoxXMark,
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
  HiPencil,
  HiTrash,
} from 'react-icons/hi2';

import Tag from '../../ui/Tag';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import CreateMailForm from './CreateMailForm';
import { formatDate, getIcon, styleRefNum } from '../../utils/helpers';
import { useDeleteMailing } from './useDeleteMailing';
import { useImplemented } from '../status/useImplemented';
import { useIgnored } from '../status/useIgnored';

const Item = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-600);
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 1.3rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

function MailingRow({ mailing }) {
  const {
    _id: mailingId,
    createdAt,
    subject,
    type,
    startDate,
    responseDays,
    status,
    refNum,
  } = mailing;

  const senderJobTitle = mailing?.sender?.jobTitle || 'undefined';
  const receiverJobTitle = mailing?.receiver?.jobTitle || 'undefined';

  const navigate = useNavigate();
  const { implemented, isImplementing } = useImplemented();
  const { ignored, isIgnoring } = useIgnored();
  const { deleteMailing, isDeleting } = useDeleteMailing();

  const statusToTagName = {
    pending: 'blue',
    processing: 'green',
    implemented: 'silver',
    ignored: 'red',
  };

  return (
    <>
      <Table.Row>
        <Item>{subject}</Item>
        <Item>{getIcon(type)}</Item>
        <Stacked>
          <span>From: {senderJobTitle}</span>
          <span>To: {receiverJobTitle}</span>
        </Stacked>
        <Stacked>
          {status === 'processing' && (
            <span>
              In {responseDays} {responseDays > 1 ? 'days' : 'day'}
            </span>
          )}

          {status === 'processing' && (
            <span>
              {formatDistance(new Date(startDate), new Date())} left &crarr;
            </span>
          )}

          <span>
            {type === 'outgoing' ? 'sent' : 'received'} {formatDate(createdAt)}
          </span>
        </Stacked>
        <Tag type={statusToTagName[status]}>{status}</Tag>
        <Item>{styleRefNum(type, refNum)}</Item>

        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={mailingId} />
            <Menus.List id={mailingId}>
              <Menus.Button
                icon={<HiEye />}
                onClick={() => navigate(`/mailings/${mailingId}`)}
              >
                See details
              </Menus.Button>

              <Menus.Button
                icon={<HiOutlineArrowPath />}
                onClick={() => navigate(`/processing/${mailingId}`)}
              >
                Processing
              </Menus.Button>

              {status === 'pending' && (
                <Menus.Button
                  icon={<HiOutlineArchiveBoxXMark />}
                  onClick={() => ignored(mailingId)}
                  disabled={isIgnoring}
                >
                  Ignored
                </Menus.Button>
              )}

              {status === 'processing' && (
                <Menus.Button
                  icon={<HiOutlineCheckCircle />}
                  onClick={() => implemented(mailingId)}
                  disabled={isImplementing}
                >
                  Implemented
                </Menus.Button>
              )}

              <Modal.Open opens='update'>
                <Menus.Button icon={<HiPencil />}>Update</Menus.Button>
              </Modal.Open>

              <Modal.Open opens='delete'>
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>

          <Modal.Window name='update'>
            <CreateMailForm mailToUpdate={mailing} />
          </Modal.Window>

          <Modal.Window name='delete'>
            <ConfirmDelete
              resourceName='mailing'
              disabled={isDeleting}
              onConfirm={() => {
                deleteMailing(mailingId);
              }}
            />
          </Modal.Window>
        </Modal>
      </Table.Row>
    </>
  );
}

export default MailingRow;
