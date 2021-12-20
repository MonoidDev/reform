import { Resolver } from '../types/Resolver';
import {
  FormControlInitialMeta,
  FormControl,
} from '../controls/FormControl';
import {
  FormControlOptions, FormResult,
} from '../controls/types';
import { ErrorMessage } from '../types/ErrorMessage';
import { useEffect, useMemo, useRef } from 'react';
import { FormControlMap, identityRefine, StructFormControl, StructOutputOf } from '../controls/StructFormControl';

export function useStruct<
  M extends FormControlMap,
  O = StructOutputOf<M>,
  R extends (i: StructOutputOf<M>) => FormResult<O> = ((i: StructOutputOf<M>) => FormResult<O>),
>(
  controls: Readonly<M>,
  refine: R = identityRefine,
  deps: unknown[] = [],
) {

  const control = useMemo(() => {
    const form = new StructFormControl<M, O>(controls, refine);
    return form;
  }, deps);

  return control;
}

export function useFormControl<
  I,
  O,
  E extends ErrorMessage = ErrorMessage,
  Name extends string = string
>(
  resolver: Resolver<I, O, E, Name>,
  initialInput: I,
  deps: unknown[] = [],
  initialMeta: FormControlInitialMeta<O> = {},
  options: FormControlOptions = {},
) {
  const lastControl = useRef<FormControl<I, O, E, Name> | undefined>(undefined);

  const control = useMemo(() => {
    const form = new FormControl<I, O, E, Name>(
      resolver,
      lastControl.current?.getInput() ?? initialInput,
      initialMeta,
      options,
    );
    lastControl.current?.unsubcribe();
    lastControl.current = form;
    return form;
  }, deps);

  useEffect(() => () => {
    control.unsubcribe();
  }, []);

  return control;
}

export function useTextInput<
  O,
  E extends ErrorMessage = ErrorMessage,
  Name extends string = string
>(
  resolver: Resolver<string, O, E, Name>,
  initialInput: string = '',
  deps: unknown[] = [],
  initialMeta: FormControlInitialMeta<O> = {},
  options: FormControlOptions = {},
) {
  return useFormControl(
    resolver,
    initialInput,
    deps,
    initialMeta,
    options,
  );
}

export function useCheckbox<
  O,
  E extends ErrorMessage = ErrorMessage,
  Name extends string = string
>(
  resolver: Resolver<boolean, O, E, Name>,
  initialInput: boolean,
  deps: unknown[] = [],
  initialMeta: FormControlInitialMeta<O> = {},
  options: FormControlOptions = {},
) {
  return useFormControl(
    resolver,
    initialInput,
    deps,
    initialMeta,
    options,
  );
}
