import { tf } from "tailwind-factory";

export const ButtonContainer = tf("button", `
  rounded-md
  px-4
  py-2
  text-base
  font-medium
  md:px-6
  md:pt-3
  md:pb-[.9rem]
  md:text-xl
  2xl:text-2xl
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
    }
  },
  defaultVariants: {
    theme: "primary"
  }
});