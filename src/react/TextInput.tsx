import React from 'react';
import { useInput } from './observingHooks';
import { BaseFormControlProps } from './utils';

export type TextInputProps = React.HTMLProps<HTMLInputElement> &
  BaseFormControlProps<string>;

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => {
    const { control, onChange, onBlur, ...rest } = props;

    const input = useInput(control);

    return (
      <input
        ref={ref}
        onChange={(e) => {
          onChange?.(e);
          if (control.input.getValue() !== e.target.value) {
            control.input.next(e.target.value);
          }
        }}
        onBlur={(e) => {
          onBlur?.(e);
          if (!control.touched.getValue()) {
            control.touched.next(true);
          }
        }}
        value={input}
        {...rest}
      />
    );
  },
);
