import { useForm } from 'react-hook-form';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';

import { useCreateContact } from './useCreateContact';
import { useUpdateContact } from './useUpdateContact';

function CreateContactForm({ contactToEdit = {}, onCloseModal }) {
  const { isCreating, createContact } = useCreateContact();
  const { isUpdating, updateContact } = useUpdateContact();
  const isWorking = isCreating || isUpdating;

  const { _id: editId, ...editValues } = contactToEdit;
  const isEditSession = Boolean(editId);
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  function onSubmit(data) {
    if (isEditSession) {
      updateContact(
        { newContactData: data, id: editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    } else {
      createContact(
        { ...data },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    }
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? 'modal' : 'regular'}
    >
      <FormRow label='Job Title' error={errors?.jobTitle?.message}>
        <Input
          type='text'
          id='jobTitle'
          disabled={isWorking}
          {...register('jobTitle', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label='Name'>
        <Input
          type='text'
          id='name'
          disabled={isWorking}
          {...register('name')}
        />
      </FormRow>

      <FormRow label='Email'>
        <Input
          type='text'
          id='email'
          disabled={isWorking}
          {...register('email')}
        />
      </FormRow>

      <FormRow label='Phone'>
        <Input
          type='text'
          id='phone'
          disabled={isWorking}
          {...register('phone')}
        />
      </FormRow>

      <FormRow>
        <Button
          variation='secondary'
          type='reset'
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? 'Update contact' : 'Create new contact'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateContactForm;
