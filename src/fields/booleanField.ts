import { any } from '../types/BasicTypes';
import { Either, makeLeft, makeRight } from '../types/Either';
import { ErrorMessage } from '../types/ErrorMessage';

export const booleanField = (options: BooleanFieldOptions = {}) => {
  const { message, truthy = 'true', required } = options;

  const booleanType = any().refine((input) => {
    if (typeof input === 'boolean') return makeRight(input);
    if (input === truthy) return makeRight(true);
    if (input === '')
      return required
        ? makeLeft({ message: message ?? '' })
        : makeRight(undefined);
    return makeRight(false);
  });

  return {
    ...booleanType,
    refine<O2, E2 extends ErrorMessage = ErrorMessage>(
      validate: (input: boolean | undefined) => Either<E2, O2>,
    ) {
      return {
        ...this,
        ...booleanType.refine(validate),
      };
    },
    map<O2>(mapper: (input: boolean | undefined) => O2) {
      return {
        ...this,
        ...booleanType.map(mapper),
      };
    },
    true(message: string) {
      return this.refine((input) =>
        input === true ? makeRight(input) : makeLeft({ message }),
      );
    },
    false(message: string) {
      return this.refine((input) =>
        input === false ? makeRight(input) : makeLeft({ message }),
      );
    },
  };
};

export interface BooleanFieldOptions {
  message?: string;
  truthy?: any; // Equal to what value when we consider it truthy, by default 'true'.
  required?: boolean;
}
