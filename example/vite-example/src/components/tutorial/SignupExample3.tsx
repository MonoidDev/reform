import { useState } from 'react';

import { ErrorMessage, TextInput, useTextInput } from '@monoid-dev/reform/react'
import { stringField } from '@monoid-dev/reform';

export default function SignupExample() {
  const [result, setResult] = useState('');

  const username = useTextInput(
    stringField()
      .required('This field cannot be empty. ')
  );
  const password = useTextInput(
    stringField()
      .min(6, 'This password is too short. ')
  );

  return (
    <div>
      <TextInput control={username} placeholder="Username" />
      <ErrorMessage control={username} />
      <br />
      <TextInput control={password} placeholder="Password" />
      <ErrorMessage control={password} />
      <br />
      <button
        onClick={() => setResult(JSON.stringify({
          username: username.getOutput(),
          password: password.getOutput(),
        }))}
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
