import React from 'react';
import { useInput } from './observingHooks';
import { BaseFormControlProps } from './utils';

export type CheckboxProps = React.HTMLProps<HTMLInputElement> & BaseFormControlProps<boolean>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  const {
    control,
    onChange,
    ...rest
  } = props;

  const input = useInput(control);

  return (
    <input
      ref={ref}
      type="checkbox"
      onChange={(e) => {
        onChange?.(e);
        if (!control.touched.getValue()) {
          control.touched.next(true);
        }
        control.input.next(!input);
      }}
      checked={input}
      {...rest}
    />
  );
});
