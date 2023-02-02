import { tf } from "tailwind-factory";

export const Container = tf(
  "div",
  `
  hover:text-red-500
  md:flex
  first-letter:rounded-none
  placeholder:text-red-200
  after:text-sm
  checked:text-md
  bg-blue-200
  test
  custom-css
`,
  {}
);
