import { tf } from "tailwind-factory";

export default function Home() {
  const Container = tf(
    "div",
    `
    text-red-500
    bg-blue-200
    test
  `,
    {}
  );

  return <Container />;
}
