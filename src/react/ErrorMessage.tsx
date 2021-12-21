import React from 'react';
import { useResult, useTouched } from './observingHooks';
import { BaseAnyFormControlProps } from './utils';

export interface ErrorMessageProps extends BaseAnyFormControlProps {
  whenTouched?: boolean;
}

export const ErrorMessage: React.VFC<ErrorMessageProps> = (props) => {
  const {
    whenTouched = true,
    control,
  } = props;

  const result = useResult(control);
  const touched = useTouched(control);

  const shouldDisplay = whenTouched ? touched : true;

  console.log('ErrorMessage', touched, control, result);

  return (
    <>
      {result?._tag === 'left' && shouldDisplay ? (result?.left?.message ?? '') : null}
    </>
  );
};

