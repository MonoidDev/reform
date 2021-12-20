import { TextInput, useTextInput } from '@monoid-dev/reform/react'
import { stringField } from '@monoid-dev/reform';

export default function SignupExample() {
  const username = useTextInput(stringField());
  const password = useTextInput(stringField());

  return (
    <div>
      <TextInput control={username} placeholder="Username" />
      <br />
      <TextInput control={password} placeholder="Password" />
      <br />
    </div>
  );
}