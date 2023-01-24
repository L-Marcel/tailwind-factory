import { ReactNode } from "react";
import { tf } from "tailwind-factory";

//Example of a common use case
export const Container = tf("div", `
  flex
  flex-col
`, {
  variants: {
    theme: {
      dark: `bg-zinc-800 text-zinc-100`,
      light: `bg-white text-zinc-800`
    },
    size: {
      md: `w-full h-[200px]`,
      lg: `w-full h-screen`
    }
  },
  defaultVariants: {
    size: "lg",
    theme: "light"
  }
});

//Example extending the styles
export const Header = Container.extends(`
  flex
  justify-center
  items-center
  w-full
`, {
  variants: {
    theme: {
      dark: `bg-zinc-900 text-zinc-100`,
      light: `bg-white text-zinc-800`
    },
    border: {
      enabled: `border-b-4 border-zinc-600`,
      disabled: `text-6xl`
    },
    size: {
      sm: `h-[20%]`
    }
  },
  defaultVariants: {
    theme: "light",
    border: "enabled",
    size: "sm"
  }
});

//Example using a custom JSX component
const JSXTitle = (
  //The component need to have the className property!!
  { children, className }: { 
    children: ReactNode, 
    className?: string 
  }
) => <h2 className={className}>
{children}
</h2>;

export const Title = tf(JSXTitle, `
  text-3xl
  text-inherit
`, {})

export const Button = tf("button", `
  px-3
  pt-[0.4rem]
  pb-2
  rounded-md
  w-min
  whitespace-nowrap
  bg-teal-500
  text-zinc-900
`)

export const Section = tf("section", `
  flex
  flex-col
  h-full
  justify-center
  items-center
`)