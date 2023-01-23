import { tf } from "tailwind-factory";

export default function Home() {
  const Elem = tf("div", "", {
    variants: {
      a: {
        abc: "asdas",
        sdas: "asdas",
      },
      b: {
        test: "sadas",
      },
    },
    defaultVariants: {
      a: "abc",
      b: "test",
    },
  });

  return (
    <main>
      <Elem>abc</Elem>
    </main>
  );
}
