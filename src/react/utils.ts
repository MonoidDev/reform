import { useState } from 'react';
import { FormControl } from '../controls/FormControl';
import { AnyFormControl } from '../controls/types';

export const useForceUpdate = () => {
  const [, s] = useState({});
  return () => s({});
};

export type BaseFormControlProps<I = any> = {
  control: FormControl<I, any, any, any>;
};

export type BaseAnyFormControlProps = {
  control: AnyFormControl;
};
