import { tf } from "tailwind-factory";

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

export const Heading = tf("h1", `
  text-xl
  text-slate-100
  italic
  
  span {
    
    font-bold
  }
`, {

});

export const Description = Heading.__extends("p");