import { AnyFormControl, FormResult, Unsubscribe } from "./types";
import { BehaviorSubject, combineLatest } from 'rxjs';
import { isRight, makeLeft, makeRight } from "../types/Either";

export type ArrayInputOf<F extends AnyFormControl> = F['__input'][];

export type ArrayOutputOf<F extends AnyFormControl> = F['__output'][];

export class ArrayFormControl<F extends AnyFormControl> {
  tag: 'ArrayFormControl' = 'ArrayFormControl';
  __input!: ArrayInputOf<F>;
  __output!: ArrayOutputOf<F>;

  input: BehaviorSubject<ArrayInputOf<F>>;
  output: BehaviorSubject<ArrayOutputOf<F> | undefined>;
  result: BehaviorSubject<FormResult<ArrayOutputOf<F>> | undefined>;

  controls: readonly F[];

  unsubcribe: Unsubscribe;

  constructor(
    public initialControls: readonly F[],
  ) {
    this.controls = [...initialControls];
    this.input = new BehaviorSubject(this.getInput());
    this.output = new BehaviorSubject(this.getOutput());
    this.result = new BehaviorSubject<FormResult<ArrayOutputOf<F>> | undefined>(this.getResult());

    this.unsubcribe = this.startValidation();
  }

  getInput(): ArrayInputOf<F> {
    return this.controls.map((c) => c.getInput());
  }

  getOutput(): ArrayOutputOf<F> | undefined {
    if (this.controls.find(c => c.getOutput() === undefined)) {
      return undefined;
    }
    return this.controls.map((c) => c.getOutput());
  }

  getResult(): FormResult<ArrayOutputOf<F>> {
    if (this.controls.find(
      c => c.getResult() === undefined || isRight(c.getResult()!))
    ) {
      return makeLeft({ message: 'INNER_FORM_INVALID' });
    }
    return makeRight(this.controls.map((c) => c.getOutput()));
  }

  startValidation() {
    const inputTask = combineLatest(this.controls.map((c) => c.input))
      .subscribe({
        next: () => {
          this.input.next(this.getInput());
        },
      });

    const resultTask = combineLatest(this.controls.map((c) => c.result))
      .subscribe({
        next: () => {
          this.result.next(this.getResult());
          this.output.next(this.getOutput());
          console.log('output', this.getOutput());
        },
      });

    return () => {
      console.log('unsubbed');
      inputTask.unsubscribe();
      resultTask.unsubscribe();
    };
  }

  splice(index: number, deleteCount: number, ...items: F[]) {
    const controls = [...this.controls];
    controls.splice(index, deleteCount, ...items);
    this.controls = controls;
    this.unsubcribe?.();
    this.unsubcribe = this.startValidation();
    return this;
  }

  unshift(...items: F[]) {
    this.splice(0, 0, ...items);
    return this;
  }

  push(...items: F[]) {
    this.splice(this.controls.length, 0, ...items);
    return this;
  }

  shift() {
    this.splice(0, 1);
    return this;
  }

  pop() {
    this.splice(this.controls.length - 1, 1);
    return this;
  }

}
