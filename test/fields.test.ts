import { booleanField } from '../src/fields/booleanField';
import { numberField, requiredNumberField } from '../src/fields/numberField';
import { stringField } from '../src/fields/stringField';
import { string } from '../src/types/BasicTypes';
import { makeLeft, makeRight } from '../src/types/Either';
import { OutputOf } from '../src/types/infer';
import { makeResolver } from '../src/types/Resolver';
import { expectLeft, expectRight } from './utils';

describe('string', () => {
  it('can pipe', () => {
    const requiredString = string().pipe(
      makeResolver('requiredString', (input) => {
        if (input.length > 0) {
          return makeRight(input);
        }
        return makeLeft({
          message: 'required',
        });
      })
    );

    expectLeft(requiredString.resolve(''));
    expect(requiredString.resolve('')).toMatchSnapshot();
    expectRight(requiredString.resolve('xxx'));
  });

  it('can refine', () => {
    const requiredString = string().refine((input) =>
      input.length > 0 ? makeRight(input) : makeLeft({ message: 'required' })
    );

    expectLeft(requiredString.resolve(''));
    expect(requiredString.resolve('')).toMatchSnapshot();
    expectRight(requiredString.resolve('xxx'));
  });
});

describe('stringField', () => {
  it('can map', () => {
    expectRight(
      stringField()
        .map((s) => s.length)
        .resolve('123')
    ).toBe(3);
    expectRight(stringField().trim().resolve('     ')).toBe('');
  });

  it('can be required', () => {
    expectLeft(stringField().required('x').resolve('    '));
    expectRight(stringField().required('x').resolve(' xxx   ')).toBe('xxx');
  });
});

describe('numberField', () => {
  it('can type', () => {
    const nullable = numberField({ message: 'x' });
    const nullableV1: OutputOf<typeof nullable> = 11;
    const nullableV2: OutputOf<typeof nullable> = undefined;

    const required = requiredNumberField({ message: 'x', requiredMessage: 'x' });
    const requiredV1: OutputOf<typeof required> = 11;
    //@ts-expect-error
    const requiredV2: OutputOf<typeof required> = undefined;
  });

  it('can validate', () => {
    expectLeft(numberField({ message: 'oops' }).resolve('eqwe'));
    expectRight(numberField({ message: 'sda' }).resolve('213'));
    expectRight(numberField({ message: 'sda' }).min(3, '3').resolve(12312));
    expectLeft(numberField({ message: 'sda' }).min(3, '3').resolve(2));
    expectRight(numberField({ message: 'sda' }).integer('i').resolve(2));
    expectLeft(numberField({ message: 'sda' }).integer('i').resolve(0.0001));
    expectRight(numberField({ message: 's' }).resolve('')).toBe(undefined);
    expectLeft(requiredNumberField({ message: 's', requiredMessage: 's' }).resolve(''));
  });
});

describe('booleanField', () => {
  it('can validate', () => {
    expectRight(
      booleanField({ message: 'oops', required: true }).resolve('true')
    );
    expectRight(booleanField({ message: 'oops' }).resolve('')).toBe(undefined);
  });
});
