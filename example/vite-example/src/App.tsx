import { useRef } from 'react'
import './App.css'
import { TextInput, Checkbox, ErrorMessage, useTextInput, useCheckbox, Radio, useStruct, useInput } from '@monoid-dev/reform/react'
import { stringField, booleanField, makeLeft, makeRight } from '@monoid-dev/reform'
import SignupExample1 from './components/tutorial/SignupExample1'
import SignupExample2 from './components/tutorial/SignupExample2'
import SignupExample3 from './components/tutorial/SignupExample3'
import SignupExample4 from './components/tutorial/SignupExample4'
import SignupExample5 from './components/tutorial/SignupExample5'
import SignupExample6 from './components/tutorial/SignupExample6'
import ArrayExample1 from './components/tutorial/ArrayExample1'
import ArrayExample2 from './components/tutorial/ArrayExample2'

function ReactSimple() {
  const control = useTextInput(
    stringField()
      .min(4, 'Too short')
      .max(10, 'Too long'),
    'abcde',
  );

  return (
    <>
      <TextInput control={control} />
      <ErrorMessage control={control} />
    </>
  );
}

function ReactTouchedMessage() {
  const control = useTextInput(
    stringField()
      .min(1, 'Required'),
    '',
  );

  return (
    <>
      <TextInput control={control} />
      <ErrorMessage control={control} />
    </>
  );
}

function ReactCheckboxMessage() {
  const control = useCheckbox(
    booleanField().true('Please agree'),
    false,
  );

  return (
    <>
      <Checkbox control={control} />
      <ErrorMessage control={control} />
    </>
  );
}

function ReactRadioMessage() {
  const control = useTextInput(
    stringField(),
    '',
  );

  const input = useInput(control);

  return (
    <>
      <div>
        <Radio control={control} value="A" /> A
      </div>
      <div>
        <Radio control={control} value="B" /> B
      </div>
      <div>
        <Radio control={control} value="C" /> C
      </div>
      <div>
        <Radio control={control} value="D" /> D
      </div>
      Your choice is {input}
    </>
  );
}

function SignupExample() {
  const rendered = useRef(0);
  const struct = useStruct({
    username: useTextInput(
      stringField()
        .min(5, 'At least 5 characters'),
      '',
    ),
    password: useTextInput(
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

function App() {
  return (
    <div className="App">

      {/* <h3>
        ReactSimple
      </h3>
      <ReactSimple />
      <hr />

      <h3>
        ReactTouchedMessage
      </h3>
      <ReactTouchedMessage />
      <hr />

      <h3>
        ReactCheckboxMessage
      </h3>
      <ReactCheckboxMessage />
      <hr />

      <h3>
        ReactRadioMessage
      </h3>
      <ReactRadioMessage />
      <hr />

      <h3>
        SignupExample
      </h3>
      <SignupExample />
      <hr />

      <h2>
        Tutorial
      </h2>

      <h3>
        SignupExample1
      </h3>
      <SignupExample1 />
      <hr />

      <h3>
        SignupExample2
      </h3>
      <SignupExample2 />
      <hr />

      <h3>
        SignupExample3
      </h3>
      <SignupExample3 />
      <hr />

      <h3>
        SignupExample4
      </h3>
      <SignupExample4 />
      <hr />

      <h3>
        SignupExample5
      </h3>
      <SignupExample5 />
      <hr />

      <h3>
        SignupExample6
      </h3>
      <SignupExample6 />
      <hr />

      <h3>
        ArrayExample1
      </h3>
      <ArrayExample1 />
      <hr /> */}

      <h3>
        ArrayExample2
      </h3>
      <ArrayExample2 />
      <hr />
    </div>
  )
}

export default App;
