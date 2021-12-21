---
sidebar_position: 3
---

# Form Arrays

Arrays are common in complex forms. For example, the user is required to enter a list of family members like this:

```json
[
  {
    "name": "John Doe",
    "age": 35,
    "role": "Dad"
  },
  {
    "name": "Jane Doe",
    "age": 35,
    "role": "Mom"
  },
  {
    "name": "Joe Doe",
    "age": 12,
    "role": "Son"
  },
  {
    "name": "Woofy",
    "age": 3,
    "role": "Pet"
  }
]
```

The data format is simple: Each person is described by an object of `{ name: string, age: number, role: string }`. Now we'll show how to build the form array using a bottom-up method.

