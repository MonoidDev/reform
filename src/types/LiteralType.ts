import { isLeft, makeLeft, makeRight } from './Either';
import { ErrorMessage } from './ErrorMessage';
import { AnyResolver, OutputOf } from './infer';
import {
  ErrorContext,
  makeErrorContext,
  makeResolver,
  Resolver,
} from './Resolver';
import { isObject } from './utils';

export type LiteralValue = string | number | boolean;

export interface TLiteral<T extends LiteralValue>
  extends Resolver<unknown, T, ErrorMessage, 'literal'> {
  value: T;
}

export function literal<T extends LiteralValue>(value: T): TLiteral<T> {
  return {
    ...makeResolver<unknown, T, ErrorMessage, 'literal'>('literal', (input) => {
      if (input === value) {
        return makeRight(input as T);
      } else {
        return makeLeft({
          message: `Expect ${value}, got ${input}. `,
        });
      }
    }),
    value
  };
}
