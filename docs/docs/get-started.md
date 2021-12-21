---
sidebar_position: 1
---

# Overview

## The Why

Since the start of ReactJS, there are plenty of form libraries coming out and out. There are a handful of successful ones: [Formik](https://formik.org/), [react-hook-form](https://www.npmjs.com/package/react-hook-form), you name it. Sure, they are sweet when you are building a Login/Registration, or a basic CRUD user interface, but when data becomes nested and dynamic, they nearly always need hacking to meet such difficult requirement.

Imagine you are building a form for users to submit a list of cargos to deliver across borders, the form would contain nested data like below:

```js
{
  tag: 'CARGOS_BY_PICKUP_ADDRESS',
  port_name: 'Shanghai',
  pickup_addresses: [
    {
      id: 81,
      cargos: [
        {
          tag: 'SIZE_BY_LWH',
          name: 'Green Tea',
          num: 1,
          width: 1,
          height: 1,
          length: 1,
          weight: 1,
        },
        {
          tag: 'SIZE_BY_WV',
          name: 'Alien Food',
          num: 1,
          total_weight: 100,
          total_volumn: 10,
        },
      ],
    },
  ],
},
```

Here we face the difficulty of both nesting and dynamic checking: 

1. In the form, we can have multiple `pickup_address`. For each `pickup_address`, we have multiple cargos.
2. For each cargo, we have two ways to describe their size: `SIZE_BY_LWH` by length, weight and weight; `SIZE_BY_WV` by weight and volume.

I don't want to waste your time by telling how to achieve that complexity using Formik, and how that could sacrifice type-safety and lead to error-prone code. The key however is, simple form libraries treat the form as a whole, while in complex cases, a form could be treated as a set of individual objects, and they can be combined, validated, created and destroyed just like ordinary objects. 

In the case above, we have the hierarchy of `form -> pickup_address -> cargos`. **Reform** is created to help you build such a hierarchical form using a down-top method. 

**Warning: this library probably don't suit you if your application is not form-heavy.**

## Installation

You can install Reform from any package managers.

```shell
npm install @monoid-dev/reform
pnpm install @monoid-dev/reform
yarn add @monoid-dev/reform
```

## Try Reform Now

```jsx live
function SignupExample() {
  const rendered = useRef(0);
  const struct = useStruct({
    username: textInput(
      stringField()
        .min(5, 'At least 5 characters'),
      '',
    ),
    password: textInput(
      stringField()
        .min(6, 'Should be at least 6 letters')
        .refine(
          (s) => /^[0-9]+$/.test(s)
          ? makeLeft({ message: 'Your password is too easy' })
          : makeRight(s),
        ),
      '',
    )
  })

  return (
    <>
      <TextInput control={struct.controls.username} placeholder="Username" />
      <br />
      <ErrorMessage control={struct.controls.username} />
      <br />
      <TextInput control={struct.controls.password} placeholder="Password" />
      <br />
      <ErrorMessage control={struct.controls.password} />
      <br />
      <br />
      <button onClick={() => alert(JSON.stringify(struct.getOutput()))}>
        Submit
      </button>
      <div>
        Rendered: {++rendered.current} times.
      </div>
    </>
  );
}
```

