import { Container } from "@/styles";
import { Button } from "components/Button";
import { Code } from "components/Code";
import { examples } from "constants/examples";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [exampleIndex, setExampleIndex] = useState(0);

  function handleNextExample() {
    setExampleIndex(index => {
      if(index < (examples.length - 1)) {
        return index + 1;
      };

      return 0;
    });
  };

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
      <Button onClick={handleNextExample} theme="secondary">
        Next Example
      </Button>
    </div>
    <Code>
      <code>
        {examples[exampleIndex]}
      </code>
    </Code>
  </Container>;
}
