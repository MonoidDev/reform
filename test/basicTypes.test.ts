import {
  any,
  array,
  boolean,
  nullType,
  number,
  object,
  string,
  undefinedType,
} from '../src/types/BasicTypes';
import { InputOf, OutputOf } from '../src/types/infer';
import { literal } from '../src/types/LiteralType';
import { struct } from '../src/types/StructType';
import { expectLeft, expectRight } from './utils';

describe('any', () => {
  it('can validate', () => {
    expectRight(any().resolve(1));
    expectRight(any().resolve('1'));
    expectRight(any().resolve({ 1: 1 }));
    expectRight(any().resolve(function () {}));
  });
});

describe('string', () => {
  it('can validate', () => {
    expectRight(string().resolve('114514'));
    expectRight(string().resolve(''));
    expectLeft(string().resolve({}));
    expectLeft(string().resolve(1));
    expectLeft(string().resolve(null));
    expectLeft(string().resolve(undefined));
    expectLeft(string().resolve([]));
  });
});

describe('number', () => {
  it('can validate', () => {
    expectRight(number().resolve(114514));
    expectRight(number().resolve(0));
    expectRight(number().resolve(Infinity));
    expectRight(number().resolve(-1));
    expectRight(number().resolve(NaN));
    expectRight(number().resolve(1.1111));
    expectRight(number().resolve(Number.MAX_VALUE));
    expectRight(number().resolve(Number.MIN_VALUE));

    expectLeft(number().resolve({}));
    expectLeft(number().resolve('1'));
    expectLeft(number().resolve(null));
    expectLeft(number().resolve(undefined));
    expectLeft(number().resolve([]));
  });
});

describe('boolean', () => {
  it('can validate', () => {
    expectRight(boolean().resolve(true));
    expectRight(boolean().resolve(false));

    expectLeft(boolean().resolve({}));
    expectLeft(boolean().resolve('1'));
    expectLeft(boolean().resolve(null));
    expectLeft(boolean().resolve(undefined));
    expectLeft(boolean().resolve([]));
    expectLeft(boolean().resolve(1));
  });
});

describe('null', () => {
  it('can validate', () => {
    expectRight(nullType().resolve(null));

    expectLeft(nullType().resolve({}));
    expectLeft(nullType().resolve('1'));
    expectLeft(nullType().resolve(undefined));
    expectLeft(nullType().resolve([]));
    expectLeft(nullType().resolve(1));
  });
});

describe('undefined', () => {
  it('can validate', () => {
    expectRight(undefinedType().resolve(undefined));

    expectLeft(undefinedType().resolve({}));
    expectLeft(undefinedType().resolve('1'));
    expectLeft(undefinedType().resolve(null));
    expectLeft(undefinedType().resolve([]));
    expectLeft(undefinedType().resolve(1));
  });
});

describe('object', () => {
  it('can validate', () => {
    expectRight(object().resolve({}));
    expectRight(object().resolve(() => {}));
    expectRight(object().resolve(function () {}));
    expectRight(object().resolve([]));

    expectLeft(object().resolve(undefined));
    expectLeft(object().resolve('1'));
    expectLeft(object().resolve(null));
    expectLeft(object().resolve(1));
  });
});

describe('struct', () => {
  const person = struct({
    age: number(),
    name: string(),
  });

  const nested = struct({
    nested: struct({
      age: number(),
    }),
    outer: number(),
  });

  const multi = struct({
    nested: struct({
      nested1: struct({
        age: number(),
      }),
      nested2: struct({
        age: number(),
        name: string(),
      }),
    }),
  });

  const multi2 = struct({
    a: number(),
    b: number(),
    c: number(),
  });

  it('can type', () => {
    const personO: OutputOf<typeof person> = {
      age: 1,
      name: 'Shit',
    };

    const personI: InputOf<typeof person> = {
      age: '1',
      name: {},
    };

    const nestedO: OutputOf<typeof nested> = {
      nested: {
        age: 1,
      },
      outer: 1,
    };
  });

  it('can validate', () => {
    expectRight(
      person.resolve({
        age: 0,
        name: 'shit',
      })
    );

    expectLeft(
      person.resolve({
        age: '1',
        name: NaN,
      })
    );

    expectRight(
      nested.resolve({
        nested: {
          age: 1,
        },
        outer: 123,
      })
    );

    expectLeft(
      nested.resolve({
        nested: {
          age: '1',
        },
        outer: 123,
      })
    );

    expect(
      nested.resolve({
        nested: {
          age: '1',
        },
        outer: 123,
      })
    ).toMatchSnapshot();

    expectLeft(
      multi.resolve({
        nested: {
          nested1: {
            age: '1123',
          },
          nested2: {
            age: '12321',
            name: 123213,
          },
        },
      })
    );

    expect(
      multi.resolve({
        nested: {
          nested1: {
            age: '1123',
          },
          nested2: {
            age: '12321',
            name: 123213,
          },
        },
      })
    ).toMatchSnapshot();

    expectLeft(
      multi.resolve({
        nested: {
          nested1: {
            age: '1123',
          },
          nested2: undefined as any,
        },
      })
    );

    expect(
      multi.resolve({
        nested: {
          nested1: {
            age: '1123',
          },
          nested2: undefined as any,
        },
      })
    ).toMatchSnapshot();
  });
});

describe('array', () => {
  const simple = array(number());

  const objects = array(struct({
    age: number(),
    gender: string(),
  }));

  it('can type', () => {
    const a1: OutputOf<typeof simple> = [1, 2, 3];

    const a2: OutputOf<typeof objects> = [
      {
        age: 1,
        gender: "F"
      },
      {
        age: 2,
        gender: "M",
      },
    ];
  });

  it('can validate', () => {
    expectRight(simple.resolve([1, 2, 3]));
    expectLeft(simple.resolve([1, 2, "3"]));
    expect(simple.resolve([1, 2, "3"])).toMatchSnapshot();

    const inner = struct({
      array: array(string()),
    });

    expectLeft(inner.resolve({
      array: [{}, 1, 'sad'],
    }));

    expect(inner.resolve({
      array: [{}, 1, 'sad'],
    })).toMatchSnapshot();
  });
});

describe('literal', () => {
  const simple = literal('A');

  it('can type', () => {
    const a: OutputOf<typeof simple> = 'A';
  })

  it('can validate', () => {
    expectRight(simple.resolve('A'));
    expectLeft(simple.resolve('B'));
    expect(simple.resolve('B')).toMatchSnapshot();
  });
});
