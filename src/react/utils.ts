import { useState } from 'react';

export const useForceUpdate = () => {
  const [, s] = useState({});
  return () => s({});
}
