import { Container } from "@/styles/pages/home";
import Image from "next/image";

export default function Home() {
  return (
    <Container>
      <Image
        alt="The app's logo. It says 'Tailwind Factory'"
        width={1024}
        height={200}
        quality={80}
        src="/logo.png"
      />
      <section>
        <h1>
          In <span>work</span>...
        </h1>
        <section>
          <h1>
            I{"'"}m <span>testing</span>...
          </h1>
        </section>
      </section>

      <h1>
        Just <span>testing</span>...
      </h1>
    </Container>
  );
}
