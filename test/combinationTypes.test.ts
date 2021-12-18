import { literal } from '../src/types/LiteralType';

import { union } from '../src/types/CombinationTypes';
import { OutputOf } from '../src/types/infer';
import { expectLeft, expectRight } from './utils';
import { struct } from '../src/types/StructType';
import { string } from '../src/types/BasicTypes';

describe('union', () => {
  const enumerateSimple = union([literal('A')]);

  const enumerate = union([
    literal('A'),
    literal('B'),
    literal('C'),
    literal('D'),
  ]);

  it('can type', () => {
    const v1: OutputOf<typeof enumerateSimple> = 'A';  
    // @ts-expect-error
    const v2: OutputOf<typeof enumerateSimple> = 'B';

    const v3: OutputOf<typeof enumerate> = 'A';
    const v4: OutputOf<typeof enumerate> = 'B';
    const v5: OutputOf<typeof enumerate> = 'C';
    const v6: OutputOf<typeof enumerate> = 'D';

    // @ts-expect-error
    const v7: OutputOf<typeof enumerate> = '';
  });

  it('can reflect', () => {
    expect(enumerate.types[0].value).toBe('A');
    expect(enumerate.types[1].value).toBe('B');
    expect(enumerate.types[2].value).toBe('C');
    expect(enumerate.types[3].value).toBe('D');
  });

  it('can validate', () => {
    expectRight(enumerate.resolve('A')).toBe('A');
    expectRight(enumerate.resolve('B')).toBe('B');

    expectLeft(enumerate.resolve('')).toMatchSnapshot();
    expectLeft(enumerate.resolve({})).toMatchSnapshot();

    const nested = struct({
      gender: union([
        literal('M'),
        literal('F'),
        literal('Other'),
      ]),
      name: string(),
    });

    expectLeft(nested.resolve({
      gender: '',
      name: 0,
    })).toMatchSnapshot();
  });
});
