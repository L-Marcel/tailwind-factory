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

  pt-6
  md:pt-10
  2xl:pt-14

  bg-slate-900

  .background-left {
    relative
    after:absolute
    after:w-5
    after:bg-blue-500
    after:h-5
  }
`);