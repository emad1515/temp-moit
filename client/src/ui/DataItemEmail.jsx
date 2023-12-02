import styled from 'styled-components';

const StyledDataItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding: 0.8rem 0;
  margin-left: auto;
`;

const Label = styled.span`
  display: flex;

  align-items: center;
  gap: 0.8rem;
  font-weight: 600;

  & svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-brand-600);
  }
`;

function DataItemEmail({ icon, label, children }) {
  return (
    <StyledDataItem>
      <Label>
        {icon}
        <span>{label}</span>
      </Label>
      {children}
    </StyledDataItem>
  );
}

export default DataItemEmail;
