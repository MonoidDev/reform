import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { SimpleTextInput } from './components/SimpleTextInput'
import { TextInput } from 'tyrann-io/react'
import { FormControl, stringField, StructFormControl, ArrayFormControl } from 'tyrann-io'

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
    </div>
  )
}

export default App
