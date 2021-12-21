import React, { useRef } from 'react';

import { requiredNumberField, stringField, StructFormControl, textInput } from '@monoid-dev/reform';
import { ErrorMessage, TextInput, useArray } from '@monoid-dev/reform/react';
import { useControls } from '@monoid-dev/reform/react';

const makeMemberControl = () => new StructFormControl({
  name: textInput(stringField().required('*')),
  age: textInput(requiredNumberField()),
  role: textInput(stringField().required('*')),
}, {
  tag: 'member'
});

const makePetControl = () => new StructFormControl({
  name: textInput(stringField().required('*')),
  age: textInput(requiredNumberField()),
  role: textInput(stringField().required('*')),
  breed: textInput(stringField().required('*')),
}, {
  tag: 'pet',
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

export interface PetFormProps {
  control: ReturnType<typeof makePetControl>;
  onDelete: () => void;
}

export const PetForm: React.VFC<PetFormProps> = ({ control, onDelete }) => {
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
      <TextInput control={control.controls.breed} placeholder="Breed" />
      <ErrorMessage control={control.controls.breed} />
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
  const arrayControl = useArray<ReturnType<typeof makeMemberControl> | ReturnType<typeof makePetControl>>([
    makeMemberControl(),
  ]);
  const controls = useControls(arrayControl);

  return (
    <div>
      {controls.map((control, index) => (
        control.tag === 'pet'
          ? (
            <PetForm
              key={index}
              control={control}
              onDelete={() => arrayControl.splice(index, 1)}
            />
          )
          : (
            <MemberForm
              key={index}
              control={control}
              onDelete={() => arrayControl.splice(index, 1)}
            />
          )
      ))}

      <div>
        <button onClick={() => arrayControl.push(makeMemberControl())}>
          Add Member
        </button>
        <button onClick={() => arrayControl.push(makePetControl())}>
          Add Pet
        </button>
      </div>

      <button
        onClick={() => {
          arrayControl.touchAll();
          console.log(arrayControl.getOutput())
          alert(JSON.stringify(arrayControl.getOutput()));
        }}
      >
        Submit
      </button>

      Rendered:
      {' '}
      {++rendered.current}
    </div>
  );
};
