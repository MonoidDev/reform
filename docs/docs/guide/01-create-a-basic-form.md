---
sidebar_position: 1
---

# Create a basic form

## Prerequisites

You need to have certain level of React experience. You should be mostly familiar with basic HTML, JavaScript, JSX and other modern JS stuff.

The best way to follow the tutorial would be building a simple react project on [CodeSandbox](https://codesandbox.io/s/new) or create-react-app, and then run

```shell
npm install @monoid-dev/reform
pnpm install @monoid-dev/reform
yarn add @monoid-dev/reform
```

from you project.

However, it's also okay if you don't have access to a JavaScript editor right now. You can view the code here, and see them live on this page.

## The things Reform takes care of

1. Getting values in and out from it.
2. Validating and **transforming** the value as user types.
3. Other basic state management with forms.

> Note: Reform takes a more complex methodology than Formik, but that should benefit you as your form scales.

## Build a basic signup form

Now we are required to build a signup form, the old-fashioned username-password signup that we are all tired of. The signup form, with its easy-looking apperance, handles a lot of stuff as user interacts with it:

1. Place two `<input>` tags for user to input texts.
2. Validate the username and password. We want to deny empty username and easy-to-guess passwords.
3. Tell the user what's wrong.

Let's first satisfy the first requirement.

```jsx
import { TextInput, textInput } from '@monoid-dev/reform/react'
import { stringField } from '@monoid-dev/reform';

export default function SignupExample() {
  const username = textInput(stringField());
  const password = textInput(stringField());

  return (
    <div>
      <TextInput control={username} placeholder="Username" />
      <br />
      <TextInput control={password} placeholder="Password" />
      <br />
    </div>
  );
}
```

<details>
<summary>Live Editor</summary>
<p>

```jsx live
function SignupExample() {
  const username = useTextInput(stringField());
  const password = useTextInput(stringField());

  return (
    <div>
      <TextInput control={username} placeholder="Username" />
      <br />
      <TextInput control={password} placeholder="Password" />
      <br />
    </div>
  );
}
```

</p>
</details>

Now the simple form is built up and running. It contains user's input, but doesn't do too much things. Let's take a closer look at the code.

First, we don't use any plain `<input>` here, but a `TextInput`. `TextInput` is a thin wrapper around the good old `<input>`, except it binds its value to the `control` it takes. It forwards any other properties to the original DOM `input` tag, to respect your will to customize it.

`useTextInput` is a special hook that returns a `FormControl` under the rendering context. `FormControl` manages the input and validation for a single form, and can be bound to DOM objects, thus we can store user input and handle validations against it. Note that `username` and `password` are two instances of `FormControl`, and by default persist through out the component lifespan.

`useTextInput` here takes one parameter `stringField()` . `stringField` is a function that returns a `Resolver`. `Resolver` handles data validation and transformation at the same time, and we'll discover its usage later. We can also add an optional second parameter `initialInput: string` to set its initial value.

The second step, is to add validation to our form, which is directly built upon the current code:

```jsx
import { ErrorMessage, TextInput, useTextInput } from '@monoid-dev/reform/react'
import { stringField } from '@monoid-dev/reform';

export default function SignupExample() {
  const username = useTextInput(
    stringField()
      .required('This field cannot be empty. ')
  );
  const password = useTextInput(
    stringField()
      .min(6, 'This password is too short. ')
  );

  return (
    <div>
      <TextInput control={username} placeholder="Username" />
      <ErrorMessage control={username} />
      <br />
      <TextInput control={password} placeholder="Password" />
      <ErrorMessage control={password} />
      <br />
    </div>
  );
}
```

<details>
<summary>Live Editor</summary>
<p>

```jsx live
function SignupExample() {
  const username = useTextInput(
    stringField()
      .required('This field cannot be empty. ')
  );
  const password = useTextInput(
    stringField()
      .min(6, 'This password is too short. ')
  );

  return (
    <div>
      <TextInput control={username} placeholder="Username" />
      <ErrorMessage control={username} />
      <br />
      <TextInput control={password} placeholder="Password" />
      <ErrorMessage control={password} />
      <br />
    </div>
  );
}

```

</p>
</details>

Now, try typing "short" to the password field, then click away, and it alerts us `This password is too short. `!

Let's digest the code.

First, we chain `stringField()` with a `required` method. This way, we create a *new* Resolver from the original Resolver, same as the original one but checks whether the string is empty. The similar chain is also applied to `password`'s parameter.

Second, we need to display the validation message to the user. An easy way is to use `ErrorMessage` here, which again is a component bound to the control and rendered with a single string, which doesn't make any opinion on how you style or layout the message. You can wrap it with `<div>` or `<span>` to achieve desired visual styles. `ErrorMessage` observes the `FormControl` it takes and displays whatever it has in the error message.

> Note that even though the initial values (empty strings) doesn't satisfy both requirements of `username` and `password`, we don't show the error when user hasn't touched the form, as most apps do. This is because internally we react to DOM events (in the case of `TextInput`, `onblur`) to identify whether the input is touched by the user, and all the verbose stuff is wrapped inside `TextInput`.

Hurray! We build our first form using Reform, but only the first half. We need to get the values out of the form, so that we can pass it to HTTP APIs or your client data store. That's easy.

```jsx
import { useState } from 'react';

import { ErrorMessage, TextInput, useTextInput } from '@monoid-dev/reform/react'
import { stringField } from '@monoid-dev/reform';

export default function SignupExample() {
  const [result, setResult] = useState('');

  const username = useTextInput(
    stringField()
      .required('This field cannot be empty. ')
  );
  const password = useTextInput(
    stringField()
      .min(6, 'This password is too short. ')
  );

  return (
    <div>
      <TextInput control={username} placeholder="Username" />
      <ErrorMessage control={username} />
      <br />
      <TextInput control={password} placeholder="Password" />
      <ErrorMessage control={password} />
      <br />
      <button
        onClick={() => setResult(JSON.stringify({
          username: username.getOutput(),
          password: password.getOutput(),
        }))}
      >
        Submit
      </button>
      <br />
      Result:
      {' '}
      {result || '-'}
    </div>
  );
}
```

<details>
<summary>Live Editor</summary>
<p>


```jsx live
function SignupExample() {
  const [result, setResult] = useState('');

  const username = useTextInput(
    stringField()
      .required('This field cannot be empty. ')
  );
  const password = useTextInput(
    stringField()
      .min(6, 'This password is too short. ')
  );

  return (
    <div>
      <TextInput control={username} placeholder="Username" />
      <ErrorMessage control={username} />
      <br />
      <TextInput control={password} placeholder="Password" />
      <ErrorMessage control={password} />
      <br />
      <button
        onClick={() => setResult(JSON.stringify({
          username: username.getOutput(),
          password: password.getOutput(),
        }))}
      >
        Submit
      </button>
      <br />
      Result:
      {' '}
      {result || '-'}
    </div>
  );
}
```


</p>
</details>


Here, we add a button below called "Submit". To get the value out of the FormControls, namely `username` and `password`, we simply call the `getOutput` method to get the output from it.

> Another similar method of FormControl is `getInput`, but gets the raw input from the user. In some cases, the output does not always equal to the input, e.g. a number input, and the input would be the number in string and the output will be real JavaScript number.