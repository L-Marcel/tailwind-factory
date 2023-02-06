import { tf } from "tailwind-factory";

//No utility classes were detected in your source
export const Container = tf(
  "div",
  `
  ~ h1 {
    text-base
  }

  div {
    sm:bg-test-500
    text-test-700

    ~ h2 {
      text-gray-700
    }
    
    > h1, > h2 {
      text-xl
    }
  }
`,
  {
    variants: {
      theme: {
        dark: `
        ~ h2 {
          text-red-500
        }

        p {
          text-lg
    
          span, strong {
            text-blue-600
          }
        }
      `,
        light: `
        ~ h2 {
          text-red-400
        }
      `,
      },
    },
    defaultVariants: {
      theme: "dark",
    },
  }
);
