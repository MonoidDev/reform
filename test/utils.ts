import { Either, isLeft, isRight } from "../src/types/Either";

export const expectLeft = <T>(t: Either<T, any>) => {
   expect(isLeft(t)).toBe(true);
   if (isRight(t)) throw 0;
   return expect(t.left);
}

export const expectRight = <T>(t: Either<any, T>) => {
  expect(isRight(t)).toBe(true);
  if (isLeft(t)) throw 0;
  return expect(t.right);
}