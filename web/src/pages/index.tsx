import { Container, Description, Heading } from "@/styles";
import Image from "next/image";

export default function Home() {
  return <Container className="">
    <Image
      src="/logo.png"
      width={1024}
      height={200}
      alt="Library logo, the text was made with two colors: purple and blue. It says 'tailwind factory'"
    />
    <Heading>A <span>CSS in JS</span> library to create styles using a syntax based on Tailwind's classes declarations.</Heading>
    <Description>... <span>testing</span> ...</Description>
  </Container>;
}
