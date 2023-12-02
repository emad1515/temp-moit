import { useFieldArray, useForm } from 'react-hook-form';
import { HiOutlineTrash } from 'react-icons/hi2';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import SelectType from '../../ui/SelectType';
import FormRow from '../../ui/FormRow';
import FormRowCc from '../../ui/FormRowCc';
import { useCreateDocument } from './useCreateDocument';
import { useUpdateDocument } from './useUpdateDocument';
import { FILES_TYPE } from '../../utils/constants';

function CreateDocumentForm({ mailToUpdate = {}, onCloseModal }) {
  const { isCreating, createDocument } = useCreateDocument();
  const { isUpdating, updateDocument } = useUpdateDocument();

  const isWorking = isCreating || isUpdating;
  const { _id: updateId, ...updateValue } = mailToUpdate;
  const isUpdateSession = Boolean(updateId);

  const { register, control, handleSubmit, reset, formState } = useForm({
    defaultValues: isUpdateSession ? updateValue : {},
  });

  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({
    name: 'tags',
    control,
  });

  async function onSubmit(data) {
    const tags = data.tags?.flatMap(tag => tag.name);
    const file = typeof data.file === 'string' ? data.file : data.file[0];

    const newData = {
      ...data,
      tags,
      file,
    };

    if (isUpdateSession)
      updateDocument(
        { newMailData: newData, id: updateId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      createDocument(newData, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? 'modal' : 'regular'}
    >
      <FormRow label='Subject' error={errors?.subject?.message}>
        <Input
          type='text'
          id='subject'
          disabled={isWorking}
          {...register('subject', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label='Type' error={errors?.type?.message}>
        <SelectType
          options={[{ value: '', label: 'Select...' }, ...FILES_TYPE]}
          disabled={isWorking}
          registerField={{
            ...register('type', {
              required: 'This field is required',
            }),
          }}
        />
      </FormRow>

      {fields.map((field, index) => {
        return (
          <FormRowCc label='Tag' key={field.id}>
            <Input
              type='text'
              defaultValue={mailToUpdate?.tags?.at(index) || undefined}
              {...register(`tags.${index}.name`)}
            />

            {index > 0 && <HiOutlineTrash onClick={() => remove(index)} />}
          </FormRowCc>
        );
      })}

      <Button
        size='small'
        onClick={e => {
          e.preventDefault();
          append({ name: '' });
        }}
      >
        Add Tag
      </Button>

      <FormRow label='Observations'>
        <Textarea
          type='number'
          id='notes'
          defaultValue=''
          {...register('notes')}
        />
      </FormRow>

      <FormRow label='Document File'>
        <FileInput id='file' accept='.pdf' {...register('file')} />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation='secondary'
          type='reset'
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isUpdateSession ? 'Update document' : 'Create new document'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateDocumentForm;
