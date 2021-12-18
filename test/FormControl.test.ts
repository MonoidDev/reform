import { FormControl, StructFormControl } from '..';
import { stringField } from '../src/fields/stringField';

import assert from 'assert'

describe('string', () => {
  it('can compose', () => {
    const nameControl = new FormControl(
      stringField().required('Name is required'),
      String(''),
    );
    const passwordControl = new FormControl(
      stringField().min(6, 'Password must be at least 6 letters'),
      String(''),
    );

    const signUpControl = new StructFormControl({
      name: nameControl,
      password: passwordControl,
    });

    assert.strictEqual(nameControl, signUpControl.controls.name);
    
    const subscribedValues: string[] = [];
    const subscribedErrors: string[] = [];
  
    nameControl.input.forEach((v) => {
      subscribedValues.push(v);
    });
    nameControl.result.forEach((e) => {
      if (e?._tag === 'left') {
        subscribedErrors.push(e.left?.message ?? '');
      } else {
        subscribedErrors.push('');
      }
    })

    assert.deepStrictEqual(subscribedValues, ['']);
    assert.deepStrictEqual(subscribedErrors, ['Name is required']);

    nameControl.input.next('123');

    assert.deepStrictEqual(subscribedErrors, ['Name is required', '']);
  });
});