import { useEffect, useState } from 'react';
import { FormControl } from '@monoid-dev/reform';

export interface SimpleTextInputProps {
  formControl: FormControl<string, string>;
}

export const SimpleTextInput: React.VFC<SimpleTextInputProps> = (props) => {
  const {
    formControl,
  } = props;

  const [, setState] = useState({});

  useEffect(() => {
    formControl.input.forEach(() => {
      setState({});
    });

    formControl.result.forEach(() => {
      setState({});
    });
  }, []);

  const result = formControl.result.getValue();
  const error = result?._tag === 'left' ? result?.left?.message : '-';

  return (
    <>
      <input
        value={formControl.input.getValue()}
        onChange={(e) => formControl.input.next(e.target.value)}
      />
      <p>
        Error: {error}
      </p>
    </>
  );
}