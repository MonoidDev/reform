/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import * as ReformReact from '@monoid-dev/reform/react'
import * as Reform from '@monoid-dev/reform'

// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...React,
  ...Reform,
  ...ReformReact,
};

export default ReactLiveScope;
