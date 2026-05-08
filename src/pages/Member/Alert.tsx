import { Container } from "../../components/Container";
import { Row } from "../../components/Row";
import { MeatballsMenu } from "../../components/MeatballsMenu";
import { Logo } from "../../components/Logo";
import { AlertCard } from "../../components/AlertCard";
import { Line } from "../../components/Line";
import { Navbar } from "../../components/Navbar";

import { mockAlerts } from "../../mocks/mockData";

export function Alert() {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);

    return (
      date.toLocaleDateString("pt-BR") +
      " às " +
      date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  return (
    <>
      <Container>
        <Row typeRow="row-space">
          <Logo />
          <MeatballsMenu />
        </Row>

        <h1>Avisos</h1>

        {mockAlerts.map((alert, index) => (
          <>
            <AlertCard
              key={alert.id}
              id={alert.id}
              author={alert.author}
              image={alert.image}
              date={formatDate(alert.publishedAt)}
              description={alert.description}
            />
            {mockAlerts.length > 1 && index < mockAlerts.length - 1 && <Line />}
          </>
        ))}
      </Container>

      <Navbar />
    </>
  );
}
