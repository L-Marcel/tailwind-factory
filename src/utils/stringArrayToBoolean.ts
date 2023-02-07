export function stringArrayToBoolean(values: string[]) {
  return values.reduce(
    (prev, value) => {
      prev[value] = true;
      return prev;
    },
    {} as {
      [key: (typeof values)[number]]: true;
    }
  );
}
