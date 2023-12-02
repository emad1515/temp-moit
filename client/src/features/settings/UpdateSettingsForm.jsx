import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Spinner from '../../ui/Spinner';

import { useSettings } from './useSettings';
import { useUpdateSetting } from './useUpdateSetting';

function UpdateSettingsForm() {
  const { isLoading, settings: { minResponseDays, maxResponseDays } = {} } =
    useSettings();
  const { isUpdating, updateSetting } = useUpdateSetting();

  if (isLoading) return <Spinner />;

  function handleUpdate(e, field) {
    const { value } = e.target;
    if (!value) return;
    updateSetting({ [field]: value });
  }

  return (
    <Form>
      <FormRow label='Minimum Response days'>
        <Input
          type='number'
          id='minResponseDays'
          defaultValue={minResponseDays}
          disabled={isUpdating}
          onBlur={e => handleUpdate(e, 'minResponseDays')}
        />
      </FormRow>

      <FormRow label='Maximum Response days'>
        <Input
          type='number'
          id='maxResponseDays'
          defaultValue={maxResponseDays}
          disabled={isUpdating}
          onBlur={e => handleUpdate(e, 'maxResponseDays')}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
