import { AnyResolver } from './infer';
import { TLiteral, literal } from './LiteralType';

import { TUnion, union } from './CombinationTypes';

export const omittable = <R extends AnyResolver>(
  r: R,
): TUnion<[R, TLiteral<undefined>]> => union([r, literal(undefined)]);
