import { tf } from "tailwind-factory";

export const Container = tf(
  "div", `
  flex
  flex-col
  items-center

  w-screen
  h-screen
  overflow-hidden

  pt-6
  md:pt-10
  2xl:pt-14

  bg-slate-800

  .background-left {
    relative
    after:fixed
    after:bg-transparent
    after:border-slate-700
    after:border-t-[95vh]
    after:border-r-[2rem]
    md:after:border-r-[6rem]
    lg:after:border-r-[8rem]
    xl:after:border-r-[12rem]
    after:border-r-transparent
    after:top-0
    after:left-0
  }

  .background-right {
    relative
    after:fixed
    after:bg-transparent
    after:border-slate-700
    after:border-b-[95vh]
    after:border-l-[2rem]
    md:after:border-l-[6rem]
    lg:after:border-l-[8rem]
    xl:after:border-l-[12rem]
    after:border-l-transparent
    after:bottom-0
    after:right-0
  }

  #button-group {
    flex
    flex-row
    gap-6
  }

  section {
    fixed
    bottom-0
    px-4
    md:mx-auto
    flex
    flex-col
    md:flex-row
    justify-center
    gap-5
    md:gap-20
    min-w-full

    pre {
      last:rounded-b-none
      md:rounded-b-none
    }
  }
`);