import { AnyFormControl, FormResult, Unsubscribe } from "./types";
import { BehaviorSubject, combineLatest, tap } from 'rxjs';
import { isLeft, isRight, makeLeft, makeRight } from "../types/Either";

export type FormControlMap = { [K in string]: AnyFormControl; };

export type StructInputOf<M extends FormControlMap> = {
  [K in keyof M]: M[K]['__input']
}

export type StructOutputOf<M extends FormControlMap> = {
  [K in keyof M]: M[K]['__output']
}

export const identityRefine = ((x: any) => makeRight(x)) as any;

export class StructFormControl<
  M extends FormControlMap,
  O = StructOutputOf<M>,
  R extends (i: StructOutputOf<M>) => FormResult<O> = ((i: StructOutputOf<M>) => FormResult<O>),
> {
  tag: 'StructFormControl' = 'StructFormControl';
  __input!: StructInputOf<M>;
  __output!: O;

  input: BehaviorSubject<StructInputOf<M>>;
  output: BehaviorSubject<O | undefined>;
  result: BehaviorSubject<FormResult<O | undefined>>;
  touched: BehaviorSubject<boolean>;

  unsubcribe: Unsubscribe;

  constructor(
    public controls: Readonly<M>,
    public refine: R = identityRefine,
  ) {
    this.input = new BehaviorSubject(this.getInput());
    this.output = new BehaviorSubject<O | undefined>(
      this.getOutput(),
    );
    this.result = new BehaviorSubject<FormResult<O | undefined>>(
      this.getResult(),
    );
    this.touched = new BehaviorSubject(this.getTouched());

    this.unsubcribe = this.startValidation();
  }

  getInput(): StructInputOf<M> {
    const object: any = {};
    for (const [key, control] of Object.entries(this.controls)) {
      object[key] = control.getInput();
    }
    return object;
  }

  getOutput(): O | undefined {
    const object: any = {};
    for (const [key, control] of Object.entries(this.controls)) {
      const c = control as AnyFormControl;
      object[key] = c.getOutput();
      if (object[key] === undefined) return undefined;
    }
    const refined = this.refine(object);
    return isRight(refined) ? refined.right : undefined;
  }

  getResult(): FormResult<O> {
    const object: any = {};
    for (const [key, control] of Object.entries(this.controls)) {
      const c = control as AnyFormControl;
      const currentResult = c.result.getValue();
      if (currentResult === undefined || isLeft(currentResult)) {
        return makeLeft({ message: '' });
      }
      object[key] = control.getOutput();
    }
    console.log(this.refine(object))
    return this.refine(object);
  }

  getTouched(): boolean {
    return Object.values(this.controls).some((c: AnyFormControl) => c.getTouched());
  }

  startValidation() {
    const inputs = Object.values(this.controls).map((c: AnyFormControl) => c.input);

    const inputTask = combineLatest(inputs)
      .subscribe(() => this.input.next(this.getInput()));

    const results = Object.values(this.controls).map((c: AnyFormControl) => c.result);

    const resultTask = combineLatest(results)
      .subscribe(() => {
        this.result.next(this.getResult());
        this.output.next(this.getOutput());
      });

    const touchedSubjects = Object.values(this.controls).map((c: AnyFormControl) => c.touched);

    const touchedTask = combineLatest(touchedSubjects)
      .subscribe(() => {
        this.touched.next(this.getTouched())
      });

    return () => {
      inputTask.unsubscribe();
      resultTask.unsubscribe();
      touchedTask.unsubscribe();
    };
  }

  touchAll() {
    this.touched.next(true);
    for (const [, control] of Object.entries(this.controls)) {
      control.touchAll();
    }
  }
}
