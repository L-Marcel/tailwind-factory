import { useState } from "react";
import { Container, Header } from "./styles";

export default function Home() {
  const [isBlueTheme, setIsBlueTheme] = useState(true);

  return (
    <main>
      <Container theme={isBlueTheme? "blue":"green"}>
        
        
        <button onClick={() => setIsBlueTheme(isBlueTheme => !isBlueTheme)}/>
      </Container>
    </main>
  );
}
