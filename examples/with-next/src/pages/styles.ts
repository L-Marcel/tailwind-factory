import { tf } from "tailwind-factory";

export const Container = tf("div", `
  flex
  justify-center
  items-center
`, {
  variants: {
    theme: {
      blue: `
      bg-blue-300
      `,
      green: `
        bg-green-300
      `
    },
    size: {
      sm: `w-full h-[200px]`,
      lg: `w-full h-screen min-h-[500px]`
    }
  },
  defaultVariants: {
    size: "lg"
  }
});

export const Header = tf(Container, `
  flex
  justify-center
  items-center
  w-full
  h-full
`, {
  variants: {
    theme: {
      white: `
        bg-blue-200
      `
    }
  },
  defaultVariants: {
    size: "sm",
    theme: "white"
  }
});