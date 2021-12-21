import { FormControl } from "../controls/FormControl";
import { ErrorMessage } from "../types/ErrorMessage";
import { Resolver } from "../types/Resolver";
import { FormControlInitialMeta } from "../controls/FormControl";
import { FormControlOptions } from "../controls/types";

export function textInput<
  O,
  E extends ErrorMessage = ErrorMessage,
  Name extends string = string
>(
  resolver: Resolver<string, O, E, Name>,
  initialInput: string = '',
  initialMeta: FormControlInitialMeta<O> = {},
  options: FormControlOptions = {},
) {
  return new FormControl(
    resolver,
    initialInput,
    initialMeta,
    options,
  );
}

export function checkbox<
  O,
  E extends ErrorMessage = ErrorMessage,
  Name extends string = string
>(
  resolver: Resolver<boolean, O, E, Name>,
  initialInput: boolean = false,
  initialMeta: FormControlInitialMeta<O> = {},
  options: FormControlOptions = {},
) {
  return new FormControl(
    resolver,
    initialInput,
    initialMeta,
    options,
  );
}
