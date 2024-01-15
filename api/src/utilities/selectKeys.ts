export function selectKeys<T>(data: T, keys: Array<keyof T>): Partial<T> {
  const final: Partial<T> = {};
  keys.forEach((key) => {
    final[key] = data[key];
  });

  return final;
}
