import styled from 'styled-components';
import Tag from '../../ui/Tag';
import { getIcon, styleRefNum } from '../../utils/helpers';
import Button from '../../ui/Button';
import { Link } from 'react-router-dom';
import ImplementedButton from './ImplementedButton';

const StyledTodayItem = styled.li`
  display: grid;
  /* grid-template-columns: 8rem 2.5rem 1fr 7rem 11rem; */
  grid-template-columns: 9rem 2rem 1fr 7rem 10rem;
  gap: 1.2rem;
  align-items: center;

  font-size: 1.4rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
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

const Item = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-600);
`;

function TodayItem({ activity }) {
  const {
    _id: mailingId,
    type,
    status,
    refNum,
    receiver: { jobTitle: receiverJobTitle },
    sender: { jobTitle: senderJobTitle },
  } = activity;
  return (
    <StyledTodayItem>
      {status === 'pending' && <Tag type='blue'>pending</Tag>}
      {status === 'processing' && <Tag type='yellow'>finishing</Tag>}
      <Item>{getIcon(type)}</Item>
      <Stacked>
        <span>From: {senderJobTitle}</span>
        <span>To: {receiverJobTitle}</span>
      </Stacked>
      <Item>{styleRefNum(type, refNum)}</Item>
      {status === 'pending' && (
        <Button
          size='small'
          variation='primary'
          as={Link}
          to={`/processing/${mailingId}`}
        >
          processing
        </Button>
      )}
      {status === 'processing' && <ImplementedButton mailingId={mailingId} />}
    </StyledTodayItem>
  );
}

export default TodayItem;
