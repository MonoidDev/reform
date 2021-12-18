import React, { useMemo } from 'react';
import { FormControl } from '../controls/FormControl';
import { useForceUpdate } from './utils';

export type TextInputProps = React.HTMLProps<HTMLInputElement> & {
  control: FormControl<any, any, any, any>,
};

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const {
    control,
  } = props;

  const forceUpdate = useForceUpdate();

  useMemo(() => {
    control.input.forEach(forceUpdate);
  }, [control]);

  return (
    <input
      ref={ref}
      onChange={(e) => {
        control.input.next(e.target.value);
      }}
      value={control.input.getValue()}
    />
  );
});