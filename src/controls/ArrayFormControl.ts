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
  touched: BehaviorSubject<boolean>;

  controls: BehaviorSubject<readonly F[]>;

  unsubcribe: Unsubscribe;

  constructor(
    public initialControls: readonly F[],
  ) {
    this.controls = new BehaviorSubject<readonly F[]>([...initialControls]);
    this.input = new BehaviorSubject(this.getInput());
    this.output = new BehaviorSubject(this.getOutput());
    this.result = new BehaviorSubject<FormResult<ArrayOutputOf<F>> | undefined>(this.getResult());
    this.touched = new BehaviorSubject(this.getTouched());

    this.unsubcribe = this.startValidation();
  }

  getInput(): ArrayInputOf<F> {
    return this.getControls().map((c) => c.getInput());
  }

  getOutput(): ArrayOutputOf<F> | undefined {
    if (this.getControls().find(c => c.getOutput() === undefined)) {
      return undefined;
    }
    return this.getControls().map((c) => c.getOutput());
  }

  getResult(): FormResult<ArrayOutputOf<F>> {
    if (this.getControls().find(
      c => c.getResult() === undefined || isRight(c.getResult()!))
    ) {
      return makeLeft({ message: '' });
    }
    return makeRight(this.getControls().map((c) => c.getOutput()));
  }

  getTouched(): boolean {
    return Object.values(this.getControls()).some((c: AnyFormControl) => c.getTouched());
  }

  getControls() {
    return this.controls.getValue();
  }

  startValidation() {
    const inputTask = combineLatest(this.getControls().map((c) => c.input))
      .subscribe(() => {
        this.input.next(this.getInput());
      });

    const resultTask = combineLatest(this.getControls().map((c) => c.result))
      .subscribe(() => {
        this.result.next(this.getResult());
        this.output.next(this.getOutput());
      });

    return () => {
      inputTask.unsubscribe();
      resultTask.unsubscribe();
    };
  }

  splice(index: number, deleteCount: number, ...items: F[]) {
    const controls = [...this.getControls()];
    controls.splice(index, deleteCount, ...items);
    this.controls.next(controls);
    this.unsubcribe?.();
    this.unsubcribe = this.startValidation();
    return this;
  }

  unshift(...items: F[]) {
    this.splice(0, 0, ...items);
    return this;
  }

  push(...items: F[]) {
    this.splice(this.getControls().length, 0, ...items);
    return this;
  }

  shift() {
    this.splice(0, 1);
    return this;
  }

  pop() {
    this.splice(this.getControls().length - 1, 1);
    return this;
  }

  touchAll() {
    this.touched.next(true);
    for (const control of this.getControls()) {
      control.touchAll();
    }
  }

}
