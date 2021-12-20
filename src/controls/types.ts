import { Either } from '../types/Either';
import { ErrorMessage } from '../types/ErrorMessage';
import type { FormControl } from './FormControl'
import type { StructFormControl } from './StructFormControl'

export type AnyFormControl = FormControl<any, any, any, any> | StructFormControl<any>;

export type FormResult<O> = Either<ErrorMessage | undefined, O>;

export type Unsubscribe = () => void;

export type ValidationPolicy = 
  | {
    type: 'sync',
  }
  | {
    type: 'debounce',
    timeout?: number,
  };

export interface FormControlOptions {
  validationPolicy?: ValidationPolicy;
}
