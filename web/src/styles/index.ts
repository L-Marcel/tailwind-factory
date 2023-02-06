import { tf } from "tailwind-factory";

//No utility classes were detected in your source
export const Container = tf(
  "div",
  `
  flex
  flex-col
  items-center
  w-screen
  h-screen
  overflow-hidden
  pt-10
  bg-slate-800
`,
  {
    variants: {
      theme: {
        dark: `
          
        `,
        light: ``,
      },
    },
    defaultVariants: {
      theme: "dark",
    },
  }
);
