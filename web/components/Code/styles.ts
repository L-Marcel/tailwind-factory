import { tf } from "tailwind-factory";

export const CodeContainer = tf("pre", `
  bg-slate-900
  px-8
  py-6
  rounded-lg
  mb-4
  text-lg
  text-slate-50
  flex

  min-h-[60vh]
  min-w-[80%]
  md:min-h-[50vh]
  md:min-w-[calc(25rem+15%)]
  2xl:min-w-[calc(25rem+30%)]

  span {
    text-red-400
  }

  #pseudo {
    text-purple-400
  }

  #comment {
    text-slate-600
  }

  #bracket {
    text-yellow-200
  }
`, {});