import { Resolver } from '../types/Resolver';
import { FormControlInitialMeta, FormControl } from '../controls/FormControl';
import {
  AnyFormControl,
  FormControlOptions,
  FormResult,
} from '../controls/types';
import { ErrorMessage } from '../types/ErrorMessage';
import { useEffect, useMemo, useRef } from 'react';
import {
  FormControlMap,
  identityRefine,
  StructFormControl,
  StructOutputOf,
} from '../controls/StructFormControl';
import { ArrayFormControl } from '..';

export function useDestoryControl<F extends AnyFormControl>(f: F) {
  useEffect(
    () => () => {
      f.unsubcribe();
    },
    [f],
  );
}

export function useArray<F extends AnyFormControl>(
  initialControls: readonly F[],
  deps: unknown[] = [],
) {
  const control = useMemo(() => new ArrayFormControl(initialControls), deps);

  useDestoryControl(control);
  return control;
}

export function useStruct<
  M extends FormControlMap,
  O = StructOutputOf<M>,
  R extends (i: StructOutputOf<M>) => FormResult<O> = (
    i: StructOutputOf<M>,
  ) => FormResult<O>,
  T extends string = 'StructFormControl',
>(
  controls: Readonly<M>,
  options: {
    refine?: R;
    tag?: T;
  } = {},
  deps: unknown[] = [],
) {
  const control = useMemo(
    () => new StructFormControl<M, O, R, T>(controls, options),
    deps,
  );

  useDestoryControl(control);
  return control;
}

export function useFormControl<
  I,
  O,
  E extends ErrorMessage = ErrorMessage,
  Name extends string = string,
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

  useDestoryControl(control);
  return control;
}

export function useTextInput<
  O,
  E extends ErrorMessage = ErrorMessage,
  Name extends string = string,
>(
  resolver: Resolver<string, O, E, Name>,
  initialInput: string = '',
  deps: unknown[] = [],
  initialMeta: FormControlInitialMeta<O> = {},
  options: FormControlOptions = {},
) {
  return useFormControl(resolver, initialInput, deps, initialMeta, options);
}

export function useCheckbox<
  O,
  E extends ErrorMessage = ErrorMessage,
  Name extends string = string,
>(
  resolver: Resolver<boolean, O, E, Name>,
  initialInput: boolean,
  deps: unknown[] = [],
  initialMeta: FormControlInitialMeta<O> = {},
  options: FormControlOptions = {},
) {
  return useFormControl(resolver, initialInput, deps, initialMeta, options);
}
