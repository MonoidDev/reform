import { AnyResolver, literal } from '..';
import { union } from './CombinationTypes';

export const omittable = <R extends AnyResolver>(r: R) =>
  union([r, literal(undefined)]);
