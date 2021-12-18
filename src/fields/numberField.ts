import { any } from '../types/BasicTypes';
import { Either, makeLeft, makeRight } from '../types/Either';
import { ErrorMessage } from '../types/ErrorMessage';
import { Resolver } from '../types/Resolver';

export interface NumberFieldOptions {
  message: string;
}

export const numberField = (
  options: NumberFieldOptions
) => {
  const { message } = options;

  const numberType = any().refine((input) => {
    if (
      typeof input === 'string' &&
      input.trim().length === 0
    ) {
      return makeRight(undefined);
    }

    const parsed = Number.parseFloat(input);
    if (Number.isNaN(parsed)) {
      return makeLeft({ message });
    }
    return makeRight(parsed);
  });

  return makeNumberField(numberType);
};

export const requiredNumberField = (options: RequiredNumberFieldOptions) => {
  const { message, requiredMessage } = options;

  const numberType = any().refine((input) => {
    const parsed = Number.parseFloat(input);
    if (typeof input === 'string' && input.trim() === '') {
      return makeLeft({ message: requiredMessage });
    }

    if (Number.isNaN(parsed)) {
      return makeLeft({ message });
    }
    return makeRight(parsed);
  });

  return makeNumberField(numberType);
}

export interface RequiredNumberFieldOptions extends NumberFieldOptions {
  requiredMessage: string;
}

const makeNumberField = <TNumber extends number | undefined>(numberType: Resolver<any, TNumber, ErrorMessage, string>) => {
  return {
    ...numberType,
    refine<O2, E2 extends ErrorMessage = ErrorMessage>(
      validate: (input: TNumber) => Either<E2, O2>
    ) {
      return {
        ...this,
        ...numberType.refine(validate),
      };
    },
    map<O2>(mapper: (input: TNumber) => O2) {
      return {
        ...this,
        ...numberType.map(mapper),
      };
    },
    max(n: number, message: string) {
      return this.refine((input) =>
        input === undefined || input > n
          ? makeLeft({ message })
          : makeRight(input)
      );
    },
    min(n: number, message: string) {
      return this.refine((input) =>
        input === undefined || input < n
          ? makeLeft({ message })
          : makeRight(input)
      );
    },
    positive(message: string) {
      return this.refine((input) =>
        input === undefined || input <= 0
          ? makeLeft({ message })
          : makeRight(input)
      );
    },
    negative(message: string) {
      return this.refine((input) =>
        input === undefined || input >= 0
          ? makeLeft({ message })
          : makeRight(input)
      );
    },
    integer(message: string) {
      return this.refine((input) =>
        !Number.isSafeInteger(input) ? makeLeft({ message }) : makeRight(input)
      );
    },
  };
}