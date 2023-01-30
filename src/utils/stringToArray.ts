export function stringToArray(value?: string) {
  const haveSpace = / /g.test(value ?? "");
  const mapOfString = value ? (haveSpace ? value?.split(" ") : [value]) : [];

  return mapOfString;
}
