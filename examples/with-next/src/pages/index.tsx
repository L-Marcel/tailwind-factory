import { useState } from "react";
import { Button, Container, Header, Section, Title } from './styles';

export default function Home() {
  const [isBlueTheme, setIsBlueTheme] = useState(true);

  return (
    <Container theme={isBlueTheme? "light":"dark"}>
      <Header theme={isBlueTheme? "light":"dark"}>
        <Title>Tailwind Factory is crazy!</Title>
      </Header>
      <Section>
        <Button onClick={() => setIsBlueTheme(isBlueTheme => !isBlueTheme)}>
          Click here to change variants
        </Button>
      </Section>

    </Container>
  );
}
