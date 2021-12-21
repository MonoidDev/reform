import React, { useRef } from 'react';

import { numberField, stringField, StructFormControl, textInput } from '@monoid-dev/reform';
import { ErrorMessage, TextInput, useArray } from '@monoid-dev/reform/react';
import { useControls } from '@monoid-dev/reform/react';

const makeMemberControl = () => new StructFormControl({
  name: textInput(stringField()),
  age: textInput(numberField()),
  role: textInput(stringField()),
});

export interface MemberFormProps {
  control: ReturnType<typeof makeMemberControl>;
  onDelete: () => void;
}

export const MemberForm: React.VFC<MemberFormProps> = ({ control, onDelete }) => {
  return (
    <div>
      <TextInput control={control.controls.name} placeholder="Name" />
      <ErrorMessage control={control.controls.name} />
      <br />
      <TextInput control={control.controls.age} placeholder="Age" />
      <ErrorMessage control={control.controls.age} />
      <br />
      <TextInput control={control.controls.role} placeholder="Role" />
      <ErrorMessage control={control.controls.role} />
      <br />
      <button onClick={onDelete}>
        Delete
      </button>
      <hr />
    </div>
  );
};

export default function MemberFormArray() {
  const rendered = useRef(0);
  const arrayControl = useArray([
    makeMemberControl(),
  ]);
  const controls = useControls(arrayControl);

  return (
    <div>
      {controls.map((control, index) => (
        <MemberForm
          key={index}
          control={control}
          onDelete={() => arrayControl.splice(index, 1)}
        />
      ))}

      <div>
        <button onClick={() => arrayControl.push(makeMemberControl())}>
          Add
        </button>
      </div>

      Rendered:
      {' '}
      {++rendered.current}
    </div>
  );
};
