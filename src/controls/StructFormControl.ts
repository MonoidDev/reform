import { AnyFormControl, FormResult, Unsubscribe } from "./types";
import { BehaviorSubject, combineLatest, tap } from 'rxjs';
import { isLeft, makeLeft, makeRight } from "../types/Either";

export type FormControlMap = { [K in string]: AnyFormControl; };

export type StructInputOf<M extends FormControlMap> = {
  [K in keyof M]: M[K]['__input']
}

export type StructOutputOf<M extends FormControlMap> = {
  [K in keyof M]: M[K]['__output']
}

export class StructFormControl<M extends FormControlMap> {
  tag: 'StructFormControl' = 'StructFormControl';
  __input!: StructInputOf<M>;
  __output!: StructOutputOf<M>;

  input: BehaviorSubject<StructInputOf<M>>;
  output: BehaviorSubject<StructOutputOf<M> | undefined>;
  result: BehaviorSubject<FormResult<StructOutputOf<M>> | undefined>;

  unsubcribe: Unsubscribe;

  constructor(
    public controls: Readonly<M>,
  ) {
    this.input = new BehaviorSubject(this.getInput());
    this.output = new BehaviorSubject<StructOutputOf<M> | undefined>(
      this.getOutput(),
    );
    this.result = new BehaviorSubject<FormResult<StructOutputOf<M>> | undefined>(
      this.getResult(),
    );

    this.unsubcribe = this.startValidation();
  }

  getInput(): StructInputOf<M> {
    const object: any = {};
    for (const [key, control] of Object.entries(this.controls)) {
      object[key] = control.getInput();
    }
    return object;
  }

  getOutput(): StructOutputOf<M> | undefined {
    const object: any = {};
    for (const [key, control] of Object.entries(this.controls)) {
      const c = control as AnyFormControl;
      object[key] = c.getOutput();
      if (object[key] === undefined) return undefined;
    }
    return object;
  }

  getResult(): FormResult<StructOutputOf<M>> {
    const object: any = {};
    for (const [key, control] of Object.entries(this.controls)) {
      const c = control as AnyFormControl;
      const currentResult = c.result.getValue();
      if (currentResult === undefined || isLeft(currentResult)) {
        return makeLeft({ message: 'INNER_FORM_INVALID' });
      }
      object[key] = control.getInput();
    }
    return makeRight(object);
  }

  startValidation() {
    const inputs = Object.values(this.controls).map((c) => c.input);

    const inputTask = combineLatest(inputs)
      .subscribe({
        next: () => this.input.next(this.getInput()),
      });

    const results = Object.values(this.controls).map((c) => c.result);

    const resultTask = combineLatest(results)
      .subscribe({
        next: () => {
          console.log('structform', this.getOutput());
          this.result.next(this.getResult());
          this.output.next(this.getOutput());
        }
      });

    return () => {
      inputTask.unsubscribe();
      resultTask.unsubscribe();
    };
  }
}
