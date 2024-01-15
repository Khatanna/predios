export function deleteKeys<T>(data: T, keys: Array<keyof T>): Partial<T> {
  keys.forEach((key) => {
    delete data[key];
  });

  return data;
}
