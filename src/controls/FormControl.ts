import { BehaviorSubject, debounceTime } from 'rxjs';
import { isLeft, makeLeft } from '../types/Either';
import { ErrorMessage } from '../types/ErrorMessage';
import { Resolver, Result } from '../types/Resolver';
import { FormControlOptions, FormResult, Unsubscribe } from './types';

export interface FormControlInitialMeta<O> {
  initialResult?: Result<O>;
  initialTouched?: boolean;
}

export class FormControl<I, O, E extends ErrorMessage = ErrorMessage, Name extends string = string> {
  tag: 'FormControl' = 'FormControl';
  input: BehaviorSubject<I>;
  result: BehaviorSubject<FormResult<O> | undefined>;
  touched: BehaviorSubject<boolean>;

  unsubcribe: Unsubscribe;

  __input!: I;
  __output!: O;

  constructor(
    public resolver: Resolver<I, O, E, Name>,
    public initialInput: I,
    public initialMeta: FormControlInitialMeta<O> = {},
    public options: FormControlOptions = {},
  ) {
    this.input = new BehaviorSubject(initialInput);
    this.result = new BehaviorSubject<FormResult<O> | undefined>(this.resolveResult());
    console.log(this.input.getValue(), this.result.getValue());
    this.touched = new BehaviorSubject(initialMeta?.initialTouched ?? false);

    this.unsubcribe = this.startValidation();
  }

  resolveResult(): FormResult<O> {
    const result = this.resolver.resolve(this.input.getValue());
    if (isLeft(result)) {
      return makeLeft(result.left[result.left.length - 1].error);
    }
    return result;
  }

  validate() {
    this.result.next(this.resolveResult());
  }

  startValidation() {
    const validationPolicy = this.options.validationPolicy ?? { type: 'sync' };
    switch (validationPolicy.type) {
      case 'sync': {
        const subscription = this.input.subscribe(() => {
          this.validate();
        });
        return () => subscription.unsubscribe();
      }
      case 'debounce': {
        const subscription = this.input.pipe(
          debounceTime(validationPolicy.timeout ?? 500),
        ).subscribe(() => {
          this.validate();
        })
        return () => subscription.unsubscribe();
      }

    }

  }

  getInput(): I {
    return this.input.getValue();
  }

  getOutput(): O | undefined {
    const value = this.result.getValue();
    if (value === undefined || isLeft(value)) {
      return undefined;
    }
    return value.right;
  }

  getResult(): FormResult<O> | undefined {
    return this.result.getValue();
  }

  getTouched(): boolean {
    return this.touched.getValue();
  }

  touchAll() {
    this.touched.next(true);
  }

}
