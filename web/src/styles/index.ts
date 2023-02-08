import { tf } from "tailwind-factory";

//Don't do that!!! I'm trying it out as I go... and laughing at the size too.
export const Container = tf(
  "div", `
  flex
  flex-col
  items-center
  justify-between
  relative

  w-screen
  h-screen
  overflow-x-hidden
  overflow-y-auto

  pt-4
  md:pt-10
  2xl:pt-14

  bg-slate-800

  .background-left {
    absolute
    after:fixed
    after:bg-transparent
    after:border-slate-700
    after:border-t-[95vh]
    after:border-r-[2rem]
    md:after:border-r-[4rem]
    lg:after:border-r-[8rem]
    xl:after:border-r-[12rem]
    after:border-r-transparent
    after:top-0
    after:left-0
  }

  .background-right {
    absolute
    after:fixed
    after:bg-transparent
    after:border-slate-700
    after:border-b-[95vh]
    after:border-l-[2rem]
    md:after:border-l-[4rem]
    lg:after:border-l-[8rem]
    xl:after:border-l-[12rem]
    after:border-l-transparent
    after:bottom-0
    after:right-0
  }

  #button-group {
    flex
    justify-center
    gap-6
    -mt-[5rem]
    md:-mt-16
  }
`);