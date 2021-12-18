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

export interface TAny extends Resolver<any, any, ErrorMessage, 'any'> {}

export function any(): TAny {
  return {
    ...makeResolver<any, any, ErrorMessage, 'any'>('any', (input) =>
      makeRight(input)
    ),
  };
}

export interface TString
  extends Resolver<unknown, string, ErrorMessage, 'string'> {}

export function string(): TString {
  return {
    ...makeResolver<unknown, string, ErrorMessage, 'string'>(
      'string',
      (input) => {
        if (typeof input === 'string') {
          return makeRight(input);
        } else {
          return makeLeft({
            message: `Expect a string, got ${typeof input}. `,
          });
        }
      }
    ),
  };
}

export interface TNumber
  extends Resolver<unknown, number, ErrorMessage, 'number'> {}

export function number(): TNumber {
  return {
    ...makeResolver<unknown, number, ErrorMessage, 'number'>(
      'number',
      (input) => {
        if (typeof input === 'number') {
          return makeRight(input);
        } else {
          return makeLeft({
            message: `Expect a number, got ${typeof input}. `,
          });
        }
      }
    ),
  };
}

export interface TBoolean
  extends Resolver<unknown, boolean, ErrorMessage, 'boolean'> {}

export function boolean(): TBoolean {
  return {
    ...makeResolver<unknown, boolean, ErrorMessage, 'boolean'>(
      'boolean',
      (input) => {
        if (typeof input === 'boolean') {
          return makeRight(input);
        } else {
          return makeLeft({
            message: `Expect a boolean, got ${typeof input}. `,
          });
        }
      }
    ),
  };
}

export interface TNull extends Resolver<unknown, null, ErrorMessage, 'null'> {}

export function nullType(): TNull {
  return {
    ...makeResolver<unknown, null, ErrorMessage, 'null'>('null', (input) => {
      if (input === null) {
        return makeRight(input);
      } else {
        return makeLeft({
          message: `Expect a null, got ${typeof input}. `,
        });
      }
    }),
  };
}

export interface TUndefined
  extends Resolver<unknown, undefined, ErrorMessage, 'undefined'> {}

export function undefinedType(): TUndefined {
  return {
    ...makeResolver<unknown, undefined, ErrorMessage, 'undefined'>(
      'undefined',
      (input) => {
        if (input === undefined) {
          return makeRight(input);
        } else {
          return makeLeft({
            message: `Expect an undefined, got ${typeof input}. `,
          });
        }
      }
    ),
  };
}

export interface TObject
  extends Resolver<unknown, {}, ErrorMessage, 'object'> {}

export function object(): TObject {
  return {
    ...makeResolver<unknown, {}, ErrorMessage, 'object'>('object', (input) => {
      if (isObject(input)) {
        return makeRight(input);
      } else {
        return makeLeft({
          message: `Expect an object, got ${typeof input}. `,
        });
      }
    }),
  };
}

export interface TArray<T extends AnyResolver>
  extends Resolver<unknown, OutputOf<T>[], ErrorMessage, 'array'> {}

export function array<T extends AnyResolver>(t: T): TArray<T> {
  return {
    ...makeResolver<unknown, OutputOf<T>[], ErrorMessage, 'array'>('array'),
    resolve(input, contexts = [makeErrorContext()]) {
      if (!Array.isArray(input)) {
        contexts[contexts.length - 1].error = {
          message: `Expect an array, got ${typeof input}`,
        };
        return makeLeft(contexts);
      }

      let value: any = [];

      const newErrorContexts: ErrorContext[] = []; 
      for (let i = 0; i < input.length; i++) {
        const nextContext: ErrorContext = {
          inputPath: [...contexts[contexts.length - 1].inputPath, i],
          resolverPath: [...contexts[contexts.length - 1].resolverPath],
          error: undefined,
        };

        const result = t.resolve(input[i], [nextContext]);

        if (isLeft(result)) {
          newErrorContexts.push(...result.left);
        } else {
          value.push(result.right);
        }
      }

      if (newErrorContexts.length) {
        contexts.pop(); // Remove last context because there're no errors
        return makeLeft([
          ...contexts,
          ...newErrorContexts,
        ]);
      }

      return makeRight(value);
    }
  };
}
