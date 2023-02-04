import { tf } from "tailwind-factory";

export const Container = tf(
  "div",
  `
  bg-blue-200

  div {
    sm:bg-blue-200

    > h1 {
      text-xl
    }

    p {
      text-sm

      span, strong {
        text-yellow-300
      }
    }
  }
`,
  {}
);
