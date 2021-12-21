import { isRight, makeLeft } from './Either';
import { ErrorMessage } from './ErrorMessage';
import { AnyResolver, OutputOf } from './infer';
import {
  ErrorContext,
  makeErrorContext,
  makeResolver,
  Resolver,
} from './Resolver';

export interface TUnion<CS extends [AnyResolver, ...AnyResolver[]]>
  extends Resolver<unknown, OutputOf<CS[number]>, ErrorMessage, 'union'> {
  types: CS;
}

export function union<CS extends [AnyResolver, ...AnyResolver[]]>(
  cs: CS,
): TUnion<CS> {
  return {
    ...makeResolver<unknown, OutputOf<CS[number]>, ErrorMessage, 'union'>(
      'union',
    ),
    resolve(input, contexts = [makeErrorContext()]) {
      const newErrorContexts: ErrorContext[] = [];
      let i = 0;
      for (const resolver of cs) {
        const nextContext: ErrorContext = {
          inputPath: [...contexts[contexts.length - 1].inputPath],
          resolverPath: [...contexts[contexts.length - 1].resolverPath, i],
          error: undefined,
        };

        const result = resolver.resolve(input, [nextContext]);

        if (isRight(result)) {
          return result;
        } else {
          newErrorContexts.push(...result.left);
        }
        i++;
      }

      contexts.pop();
      return makeLeft([...contexts, ...newErrorContexts]);
    },
    types: cs,
  };
}
