import { useFieldArray, useForm } from 'react-hook-form';
import { HiOutlineTrash } from 'react-icons/hi2';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import SelectType from '../../ui/SelectType';
import FormRow from '../../ui/FormRow';
import SpinnerMini from '../../ui/SpinnerMini';
import FormRowCc from '../../ui/FormRowCc';
import customFetch from '../../utils/customFetch';
import {
  DEPARTMENTS,
  DEPARTMENT_NUM,
  DOCUMENTS_TYPE,
} from '../../utils/constants';
import { useCreateMailing } from './useCreateMailing';
import { useUpdateMailing } from './useUpdateMailing';
import { useAllContacts } from '../contacts/useAllContacts';

function CreateMailForm({ mailToUpdate = {}, onCloseModal }) {
  const { contacts: contactsApi, isLoading } = useAllContacts();
  const { isCreating, createMail } = useCreateMailing();
  const { isUpdating, updateMail } = useUpdateMailing();

  // prepare list of contacts for rendering in for (reciever)
  const contactData = contactsApi?.map(
    (contact, i) =>
      (contact[i] = { value: contact.jobTitle, label: contact.jobTitle })
  );

  contactData?.unshift({ value: '', label: 'Select...' });

  const isWorking = isCreating || isUpdating;
  const { _id: updateId, ...updateValue } = mailToUpdate;
  const isUpdateSession = Boolean(updateId);

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState,
  } = useForm({
    defaultValues: isUpdateSession
      ? {
          ...updateValue,
          sender: mailToUpdate.sender.jobTitle,
          receiver: mailToUpdate.receiver.jobTitle,
        }
      : {},
  });

  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({
    name: 'listOfCc',
    control,
  });

  const mailType = watch('type');

  const sendersList = function (listOfOption) {
    return (
      <FormRow label='Sender' error={errors?.sender?.message}>
        <SelectType
          options={listOfOption}
          disabled={isWorking}
          registerField={{
            ...register('sender', {
              required: 'This field is required',
            }),
          }}
        />
      </FormRow>
    );
  };

  const receiversList = function (listOfOption) {
    return (
      <FormRow label='Receiver' error={errors?.receiver?.message}>
        <SelectType
          options={listOfOption}
          disabled={isWorking}
          registerField={{
            ...register('receiver', {
              required: 'This field is required',
              validate: value =>
                value !== getValues().sender ||
                "The receiver's name must be different from the sender's name",
            }),
          }}
        />
      </FormRow>
    );
  };

  async function onSubmit(data) {
    const getIdContact = function (name) {
      return contactsApi.find(contact => contact.jobTitle === name)?._id;
    };

    // Mutate sender and receiver
    const sender = getIdContact(data.sender);
    const receiver = getIdContact(data.receiver);

    const fields = 'createdAt,type,sender,receiver,refNum';
    const typeAndReceiver =
      data.type === 'incoming' || data.type === 'localIncoming'
        ? `receiver=${receiver}&type=${data.type}`
        : `type=${data.type}`;

    // Import last mail outging OR incoming for refNum
    let { data: mailingsApi, error } = await customFetch.get(
      `/documents?fields=${fields}&${typeAndReceiver}&limit=1&sort=-createdAt`
    );
    mailingsApi = mailingsApi?.data?.data;

    if (error) {
      console.error(error);
      throw new Error('Mailings could not be loaded');
    }

    const allCcList = data.listOfCc?.flatMap(person =>
      getIdContact(person.name)
    );

    // Get a list of outgoing or incoming mail with the same data listed in the form
    const currentYear = new Date().getFullYear();

    // every office has rank number for incoming mails. num 0 for External outgoing mails
    // Create new refNum by concatecate 'year(2 digits) + rank + 00000'
    let rank;
    if (data.type === 'incoming' || data.type === 'localIncoming') {
      rank = DEPARTMENT_NUM?.find(dep => dep.name === data.receiver)?.num;
    } else {
      rank = 0;
    }

    let refNum;

    // 23-00001 or 23-rank-00001
    if (data.type === 'outgoing' || data.type === 'incoming')
      refNum =
        mailingsApi.length > 0
          ? Number(mailingsApi.at(0).refNum) + 1
          : Number(currentYear.toString().slice(-2) + rank + '00000') + 1;

    //2023-00001 or 2023-rank-00001
    if (data.type === 'localOutgoing' || data.type === 'localIncoming') {
      refNum =
        mailingsApi.length > 0
          ? Number(mailingsApi.at(0).refNum) + 1
          : Number(currentYear.toString() + rank + '00000') + 1;
    }

    // 2023-1
    if (data.type === 'private') {
      refNum =
        mailingsApi.length > 0
          ? Number(mailingsApi.at(0).refNum) + 1
          : Number(currentYear.toString() + '0') + 1;
    }

    const newData = {
      ...data,
      sender,
      receiver,
      listOfCc: allCcList,
    };

    const file = typeof data.file === 'string' ? data.file : data.file[0];

    if (isUpdateSession)
      updateMail(
        { newMailData: { ...newData, file }, id: updateId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      createMail(
        { ...newData, status: 'pending', refNum, file: file },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
  }

  function onError(errors) {
    console.log(errors);
  }

  if (isLoading) return <SpinnerMini />;

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
          options={[{ value: '', label: 'Select...' }, ...DOCUMENTS_TYPE]}
          disabled={isWorking}
          registerField={{
            ...register('type', {
              required: 'This field is required',
            }),
          }}
        />
      </FormRow>

      {mailType === '' &&
        sendersList([{ value: '', label: 'Select...' }, ...DEPARTMENTS])}
      {mailType === '' && receiversList(contactData)}

      {mailType === 'outgoing' &&
        sendersList([{ value: '', label: 'Select...' }, ...DEPARTMENTS])}
      {mailType === 'outgoing' && receiversList(contactData)}

      {mailType === 'incoming' && sendersList(contactData)}
      {mailType === 'incoming' &&
        receiversList([{ value: '', label: 'Select...' }, ...DEPARTMENTS])}

      {mailType === 'localOutgoing' &&
        sendersList([{ value: '', label: 'Select...' }, ...DEPARTMENTS])}
      {mailType === 'localOutgoing' &&
        receiversList([{ value: '', label: 'Select...' }, ...DEPARTMENTS])}

      {mailType === 'localIncoming' &&
        sendersList([{ value: '', label: 'Select...' }, ...DEPARTMENTS])}
      {mailType === 'localIncoming' &&
        receiversList([{ value: '', label: 'Select...' }, ...DEPARTMENTS])}

      {mailType === 'private' &&
        sendersList([{ value: '', label: 'Select...' }, ...DEPARTMENTS])}
      {mailType === 'private' && receiversList(contactData)}

      {fields.map((field, index) => {
        return (
          <FormRowCc label='Cc' key={field.id}>
            <SelectType
              options={contactData}
              disabled={isWorking}
              registerField={{
                ...register(`listOfCc.${index}.name`),
              }}
            />
            {/* <Input
              type='text'
              defaultValue={
                mailToUpdate?.listOfCc?.at(index)?.jobTitle || undefined
              }
              {...register(`listOfCc.${index}.name`)}
            /> */}

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
        Add Cc
      </Button>

      <FormRow label='Their Ref Num'>
        <Input
          type='text'
          id='theirRefNum'
          disabled={isWorking}
          {...register('theirRefNum')}
        />
      </FormRow>

      <FormRow label='Observations'>
        <Textarea
          type='number'
          id='notes'
          defaultValue=''
          {...register('notes')}
        />
      </FormRow>

      <FormRow label='Mail File'>
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
          {isUpdateSession ? 'Update mail' : 'Create new mail'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateMailForm;
