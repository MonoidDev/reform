export type Left<T> = {
  _tag: 'left';
  left: T;
};

export type Right<T> = {
  _tag: 'right';
  right: T;
};

export type Either<L, R> = Left<L> | Right<R>;

export function isLeft<L, R>(e: Either<L, R>): e is Left<L> {
  return e._tag === 'left';
}

export function isRight<L, R>(e: Either<L, R>): e is Right<R> {
  return e._tag === 'right';
}

export function makeLeft<T>(left: T): Left<T> {
  return {
    _tag: 'left',
    left,
  };
}

export function makeRight<T>(right: T): Right<T> {
  return {
    _tag: 'right',
    right,
  };
}
