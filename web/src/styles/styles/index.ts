import { tf } from "tailwind-factory";

export const Container = tf(
  "div",
  `
  text-red-200
  
  ~ h1 {
    text-xl
  }
  
  div {
    sm:bg-blue-200

    ~ h2 {
      text-red-200
    }
    
    > h1, > h2 {
      text-xl
    }

    p {
      text-lg

      span, strong {
        text-yellow-300
      }
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
