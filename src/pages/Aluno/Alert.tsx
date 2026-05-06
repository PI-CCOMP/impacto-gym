import { Container } from "../../components/Container";
import { Row } from "../../components/Row";
import { MeatballsMenu } from "../../components/MeatballsMenu";
import { Logo } from "../../components/Logo";
import { AlertCard } from "../../components/AlertCard";
import { Navbar } from "../../components/Navbar";

import fotoImg from "../../assets/img/supino-reto.jpg";

export function Alert() {
  return (
    <>
      <Container>
        <Row typeRow="row-space">
          <Logo />
          <MeatballsMenu />
        </Row>
        <h2>Avisos</h2>

        <AlertCard
          id="1"
          author="Arthur"
          description="Amanhã a academia funcionará até as 14h devido ao feriado."
          date="12/02/2025 às 08:25"
          image={fotoImg}
        />
        <h2></h2>
      </Container>
      <Navbar />
    </>
  );
}
