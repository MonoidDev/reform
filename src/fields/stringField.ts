import { string } from '../types/BasicTypes';
import { Either, makeLeft, makeRight } from '../types/Either';
import { ErrorMessage } from '../types/ErrorMessage';

export const stringField = () => {
  const stringType = string<string>();

  return {
    ...stringType,
    refine<O2, E2 extends ErrorMessage = ErrorMessage>(
      validate: (input: string) => Either<E2, O2>
    ) {
      return {
        ...this,
        ...stringType.refine(validate),
      };
    },
    map<O2>(mapper: (input: string) => O2) {
      return {
        ...this,
        ...stringType.map(mapper),
      };
    },
    trim() {
      return this.map((s) => s.trim());
    },
    matches(regexp: RegExp, message: string) {
      return this.refine((input) =>
        regexp.test(input) ? makeRight(input) : makeLeft({ message })
      );
    },
    max(n: number, message: string) {
      return this.refine((input) => input.length > n ? makeLeft({ message }) : makeRight(input));
    },
    min(n: number, message: string) {
      return this.refine((input) => input.length < n ? makeLeft({ message }) : makeRight(input));
    },
    required(message: string) {
      return this.trim().min(1, message);
    },
  };
};
