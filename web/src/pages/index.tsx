import { Container } from "@/styles";
import { Button } from "components/Button";
import { Code } from "components/Code";
import Image from "next/image";

export default function Home() {
  return <Container>
    <Image
      src="/logo.png"
      width={1024}
      height={200}
      alt="Library logo, the text was made with two colors: purple and blue. It says 'tailwind factory'"
    />
    <div className="background-left"/>
    <div className="background-right"/>
    <div id="button-group">
      <a tabIndex={-1} href="https://github.com/L-Marcel/tailwind-factory">
        <Button>
          Get Started
        </Button>
      </a>
      <Button theme="secondary">
        Next Example
      </Button>
    </div>
    <section>
      <Code>
        <span>flex</span>
        <span>flex-col</span>
        <button>test</button>
      </Code>
      <Code>
        <span>flex</span>
        <span>flex-col</span>
      </Code>
    </section>
  </Container>;
}
