import { isLeft, makeLeft, makeRight } from './Either';
import { ErrorMessage } from './ErrorMessage';
import { InputOfResolverMap, OutputOfResolverMap, ResolverMap } from './infer';
import {
  ErrorContext,
  makeErrorContext,
  makeResolver,
  Resolver,
} from './Resolver';
import { isObject } from './utils';

export interface TStruct<RM extends ResolverMap>
  extends Resolver<
    InputOfResolverMap<RM>,
    OutputOfResolverMap<RM>,
    ErrorMessage,
    'struct'
  > {
  props: RM;
}

export function struct<RM extends ResolverMap>(props: RM): TStruct<RM> {
  return {
    ...makeResolver('struct'),
    resolve(input, contexts = [makeErrorContext()]) {
      if (!isObject(input)) {
        contexts[contexts.length - 1].error = {
          message: `Expect an object, got ${typeof input}`,
        };
        return makeLeft(contexts);
      }

      let value: any = {};

      const newErrorContexts: ErrorContext[] = [];

      for (const [key, resolver] of Object.entries(props)) {
        const nextContext: ErrorContext = {
          inputPath: [...contexts[contexts.length - 1].inputPath, key],
          resolverPath: [...contexts[contexts.length - 1].resolverPath, key],
          error: undefined,
        };
        const result = resolver.resolve(input[key], [nextContext]);

        if (isLeft(result)) {
          newErrorContexts.push(...result.left);
        } else {
          value[key] = result.right;
        }
      }

      if (newErrorContexts.length) {
        contexts.pop(); // Remove last context because there're no errors
        return makeLeft([...contexts, ...newErrorContexts]);
      }

      return makeRight(value);
    },
    props,
  };
}
