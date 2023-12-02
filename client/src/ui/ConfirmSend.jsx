import styled from 'styled-components';

import Button from './Button';
import Heading from './Heading';

const StyledConfirmSend = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

function ConfirmSend({ resourceName, onConfirm, disabled, onCloseModal }) {
  return (
    <StyledConfirmSend>
      <Heading as='h3'>Send {resourceName}</Heading>
      <p>
        Are you sure you want to send this {resourceName} permanently? This
        action cannot be undone.
      </p>

      <div>
        <Button
          variation='secondary'
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancel
        </Button>
        <Button variation='danger' disabled={disabled} onClick={onConfirm}>
          Send
        </Button>
      </div>
    </StyledConfirmSend>
  );
}

export default ConfirmSend;
