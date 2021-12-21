import { useEffect } from 'react';
import { ArrayFormControl } from '..';
import { AnyFormControl } from '../controls/types';
import { useForceUpdate } from './utils';

export function useObserving<K extends 'input' | 'result' | 'touched'>(
  control: AnyFormControl,
  key: K,
) {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const sub = control[key].subscribe(() => {
      forceUpdate();
    });

    return () => {
      sub.unsubscribe();
    };
  }, [control]);
}

export function useInput<F extends AnyFormControl>(
  control: F,
): ReturnType<F['getInput']> {
  useObserving(control, 'input');

  return control.getInput();
}

export function useResult<F extends AnyFormControl>(
  control: F,
): ReturnType<F['getResult']> {
  useObserving(control, 'result');

  return control.getResult() as any;
}

export function useTouched<F extends AnyFormControl>(
  control: F,
): ReturnType<F['getTouched']> {
  useObserving(control, 'touched');

  return control.getTouched() as any;
}

export function useControls<F extends AnyFormControl>(
  array: ArrayFormControl<F>,
) {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const sub = array.controls.subscribe(forceUpdate);

    return () => {
      sub.unsubscribe();
    };
  }, [array]);

  return array.getControls();
}
