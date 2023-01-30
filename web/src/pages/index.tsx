import { tf } from "tailwind-factory";

export default function Home() {
  return (
    <Subtitle>
      In <span>work</span>...
    </Subtitle>
  );
}

const Subtitle = tf(
  "p",
  `
    text-blue-300

    span {
      font-bold
    }
  `
);
