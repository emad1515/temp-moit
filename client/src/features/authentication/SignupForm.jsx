import { useForm } from 'react-hook-form';

import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import { useSignup } from './useSignup';
import SelectType from '../../ui/SelectType';
import { DEPARTMENTS_FOR_EMPLOYEE } from '../../utils/constants';

// Email regex: /\S+@\S+\.\S+/

function SignupForm() {
  const { signup, isLoading } = useSignup();
  const { register, formState, getValues, handleSubmit, reset } = useForm();
  const { errors } = formState;

  function onSubmit(data) {
    signup(data, {
      onSettled: () => reset(),
    });
    console.log(data);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label='Department' error={errors?.department?.message}>
        <SelectType
          options={DEPARTMENTS_FOR_EMPLOYEE}
          id='department'
          disabled={isLoading}
          registerField={{
            ...register('department', {
              required: 'This field is required',
            }),
          }}
        />
      </FormRow>

      <FormRow label='Full name' error={errors?.name?.message}>
        <Input
          type='text'
          id='name'
          disabled={isLoading}
          {...register('name', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label='Email address' error={errors?.email?.message}>
        <Input
          type='email'
          id='email'
          disabled={isLoading}
          {...register('email', {
            required: 'This field is required',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Please provide a valid email address',
            },
          })}
        />
      </FormRow>

      <FormRow
        label='Password (min 8 characters)'
        error={errors?.password?.message}
      >
        <Input
          type='password'
          id='password'
          disabled={isLoading}
          {...register('password', {
            required: 'This field is required',
            minLength: {
              value: 8,
              message: 'Password needs a minimum of 8 characters',
            },
          })}
        />
      </FormRow>

      <FormRow label='Repeat password' error={errors?.passwordConfirm?.message}>
        <Input
          type='password'
          id='passwordConfirm'
          disabled={isLoading}
          {...register('passwordConfirm', {
            required: 'This field is required',
            validate: value =>
              value === getValues().password || 'Password need to match',
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation='secondary'
          type='reset'
          disabled={isLoading}
          onClick={reset}
        >
          Cancel
        </Button>
        <Button disabled={isLoading}>Create new user</Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
