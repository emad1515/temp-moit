import Button from '../../ui/Button';
import { useImplemented } from './useImplemented';

function ImplementedButton({ mailingId }) {
  const { implemented, isImplementing } = useImplemented();

  return (
    <Button
      variation='primary'
      size='small'
      onClick={() => implemented(mailingId)}
      disabled={isImplementing}
    >
      Implemented
    </Button>
  );
}

export default ImplementedButton;
