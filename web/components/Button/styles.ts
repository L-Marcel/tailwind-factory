import { tf } from "tailwind-factory";

export const ButtonContainer = tf("button", `
  rounded-md
  text-base
  font-medium
  shadow-lg
  duration-200
  transition-colors
`, {
  variants: {
    theme: {
      primary: `
        text-slate-100
        bg-slate-700
        hover:bg-blue-700
      `,
      secondary: `
        text-slate-100
        bg-blue-700
        hover:bg-blue-800
      `
    },
    size: {
      sm: `
        px-2
        py-1
        md:px-3
        md:pt-1
        md:pb-[.4rem]
        md:text-base
        2xl:text-base
      `,
      md: `
        px-4
        py-2
        md:px-6
        md:pt-3
        md:pb-[.9rem]
        md:text-xl
        2xl:text-2xl
      `
    },
    fixed: {
      true: `absolute`,
      false: ``
    }
  },
  defaultVariants: {
    theme: "primary",
    size: "md",
    fixed: "false"
  }
});