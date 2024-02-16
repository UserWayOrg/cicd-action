export function trim<T>(object: T): T {
  const result = {} as T;
  for (const key in object) {
    if (object[key] !== "") {
      result[key] = object[key];
    }
  }
  return result;
}
