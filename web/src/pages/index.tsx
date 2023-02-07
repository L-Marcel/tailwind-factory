import { Container } from "@/styles";
import Image from "next/image";

export default function Home() {
  return <Container className="2xl:text-red-500">
    <Image
      src="/logo.png"
      width={1024}
      height={200}
      alt="Library logo, the text was made with two colors: purple and blue. It says 'tailwind factory'"
    />
    <div className="background-left"/>
  </Container>;
}
