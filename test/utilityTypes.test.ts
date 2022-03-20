import { omittable } from '../src';
import {
  any,
  array,
  boolean,
  nullType,
  number,
  object,
  string,
  undefinedType,
} from '../src/types/BasicTypes';
import { InputOf, OutputOf } from '../src/types/infer';
import { literal } from '../src/types/LiteralType';
import { struct } from '../src/types/StructType';
import { expectLeft, expectRight } from './utils';

describe('utility types', () => {
  it('omittable', () => {
    expectRight(omittable(string()).resolve('x'));
    expectRight(omittable(string()).resolve(undefined));
    expectLeft(omittable(string()).resolve(1));

    expectRight(omittable(number()).resolve(1));
    expectRight(omittable(number()).resolve(undefined));
  });
});
