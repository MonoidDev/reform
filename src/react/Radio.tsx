import React from 'react';
import { useInput } from './observingHooks';
import { BaseFormControlProps } from './utils';

export type RadioProps<T> = React.HTMLProps<HTMLInputElement> &
  BaseFormControlProps<T> & {
    value: T;
  };

const RadioInner = React.forwardRef<HTMLInputElement, RadioProps<any>>(
  (props, ref) => {
    const { control, onChange, value, ...rest } = props;

    const input = useInput(control);

    return (
      <input
        ref={ref}
        type="radio"
        onChange={(e) => {
          onChange?.(e);
          if (!control.touched.getValue()) {
            control.touched.next(value);
          }
          control.input.next(value);
        }}
        checked={input === value}
        value={value}
        {...rest}
      />
    );
  },
);

export const Radio = RadioInner as <T>(
  props: RadioProps<T> & { ref?: React.ForwardedRef<HTMLInputElement> },
) => ReturnType<typeof RadioInner>;
