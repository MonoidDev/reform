import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { SimpleTextInput } from './components/SimpleTextInput'
import { TextInput, Checkbox, ErrorMessage, useTextInput, useCheckbox, Radio, useStruct } from '@monoid-dev/reform/react'
import { FormControl, stringField, StructFormControl, ArrayFormControl, booleanField, makeLeft, makeRight } from '@monoid-dev/reform'
import { useInput } from '../../../src/react/observingHooks'
import SignupExample1 from './components/tutorial/SignupExample1'
import SignupExample2 from './components/tutorial/SignupExample2'
import SignupExample3 from './components/tutorial/SignupExample3'
import SignupExample4 from './components/tutorial/SignupExample4'
import SignupExample5 from './components/tutorial/SignupExample5'
import SignupExample6 from './components/tutorial/SignupExample6'

function SimpleForm() {
  const formControl = useRef(new FormControl(
    stringField()
      .min(1, 'At least 1 character')
      .max(5, 'At most 5 characters.'),
    String(),
  ));

  return (
    <SimpleTextInput
      formControl={formControl.current}
    />
  );
}

function StructForm() {
  const formControl = useRef(new StructFormControl({
    username: new FormControl(
      stringField()
        .min(4, 'Too short')
        .max(10, 'Too long'),
      String('abcde'),
    ),
    password: new FormControl(
      stringField()
        .min(10, 'Too short'),
      String('1234567890'),
    ),
  }));

  const [, forceRefresh] = useState({});

  useEffect(() => {
    formControl.current.output.forEach(() => forceRefresh({}));
  }, []);

  return (
    <div>
      <SimpleTextInput
        formControl={formControl.current.controls.username}
      />
      <SimpleTextInput
        formControl={formControl.current.controls.password}
      />

      {JSON.stringify(formControl.current.getOutput())}
    </div>
  );
}

function ArrayForm() {
  const formControl = useRef(new ArrayFormControl([
    new FormControl(
      stringField()
        .min(1, 'At least 1 character')
        .max(5, 'At most 5 characters.'),
      String(),
    ),
  ]));

  const [, forceRefresh] = useState({});

  useEffect(() => {
    formControl.current.output.forEach(() => forceRefresh({}));
  }, [formControl.current.output]);

  return (
    <div>
      {formControl.current.controls.map((control, i) => (
        <div key={i}>
          <SimpleTextInput
            formControl={control}
          />
          <button
            onClick={() => {
              formControl.current.splice(i, 1);
              forceRefresh({});
            }}
          >
            x
          </button>
        </div>
      ))}

      <button
        onClick={() => {
          formControl.current.push(new FormControl(
            stringField()
              .min(1, 'At least 1 character')
              .max(5, 'At most 5 characters.'),
            String(),
          ));
          forceRefresh({});
        }}
      >
        add
      </button>

      <br />
      {JSON.stringify(formControl.current.getOutput())}
    </div>
  );
}

function ArrayStructForm() {
  const structFactory = () => new StructFormControl({
    username: new FormControl(
      stringField()
        .min(4, 'Too short')
        .max(10, 'Too long'),
      String('abcde'),
    ),
    password: new FormControl(
      stringField()
        .min(10, 'Too short'),
      String('1234567890'),
    ),
  });

  const formControl = useMemo(() => new ArrayFormControl([
    structFactory(),
  ]), []);

  const [, forceRefresh] = useState({});

  useEffect(() => {
    formControl.output.forEach(() => forceRefresh({}));
  }, [formControl.output]);

  return (
    <div>
      {formControl.controls.map((control, i) => (
        <div key={i} style={{ outline: '1px solid green', padding: '1rem' }}>
          <SimpleTextInput
            formControl={control.controls.username}
          />
          <SimpleTextInput
            formControl={control.controls.password}
          />
          <button
            onClick={() => {
              formControl.splice(i, 1);
              forceRefresh({});
            }}
          >
            x
          </button>
        </div>
      ))}

      <button
        onClick={() => {
          formControl.push(structFactory());
          forceRefresh({});
        }}
      >
        add
      </button>

      <br />
      {JSON.stringify(formControl.getOutput())}
    </div>
  );
}

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
      <h3>
        SimpleForm
      </h3>
      <SimpleForm />
      <hr />

      <h3>
        StructForm
      </h3>
      <StructForm />
      <hr />

      <h3>
        ArrayForm
      </h3>
      <ArrayForm />
      <hr />

      <h3>
        ArrayStructForm
      </h3>
      <ArrayStructForm />
      <hr />

      <h3>
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
    </div>
  )
}

export default App;
