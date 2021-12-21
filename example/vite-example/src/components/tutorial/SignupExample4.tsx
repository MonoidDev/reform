import { useState } from 'react';

import { ErrorMessage, TextInput, textInput, useStruct } from '@monoid-dev/reform/react'
import { stringField } from '@monoid-dev/reform';

export default function SignupExample() {
  const [result, setResult] = useState('');

  const signup = useStruct({
    username: textInput(
      stringField()
        .required('This field cannot be empty. ')
    ),
    password: textInput(
      stringField()
        .min(6, 'This password is too short. ')
    ),
  });

  return (
    <div>
      <TextInput control={signup.controls.username} placeholder="Username" />
      <ErrorMessage control={signup.controls.username} />
      <br />
      <TextInput control={signup.controls.password} placeholder="Password" />
      <ErrorMessage control={signup.controls.password} />
      <br />
      <button
        onClick={() => setResult(JSON.stringify(signup.getOutput()))}
      >
        Submit
      </button>
      <br />
      Result:
      {' '}
      {result || '-'}
    </div>
  );
}
