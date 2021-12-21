export const isObject = (input: unknown): input is {} => {
  return (
    (typeof input === 'object' || typeof input === 'function') && input !== null
  );
};
