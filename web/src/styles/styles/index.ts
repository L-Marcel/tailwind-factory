import { tf } from "tailwind-factory";

export const Container = tf(
  "div",
  `
  bg-blue-200

  div {
    text-red-200
    sm:bg-blue-200
    hover:md:text-red-600

    & > h1 {
      bg-slate-200
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
