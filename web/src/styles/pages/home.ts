import { tf } from "tailwind-factory";

export const Container = tf(
  "main",
  `
  flex
  w-full
  flex-col
  h-screen
  justify-center
  items-center
  bg-stone-100

  > section {
    h-full
    w-full
    flex
    flex-col
    h1 {
      text-center
      text-5xl

      span {
        text-blue-200
      }
    }
  }
`,
  {
    variants: {},
    defaultVariants: {},
  }
);
