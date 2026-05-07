import { Container } from "../../components/Container";
import { Logo } from "../../components/Logo";
import { MeatballsMenu } from "../../components/MeatballsMenu";
import { Row } from "../../components/Row";
import { TrainingHistoryCard } from "../../components/TrainingHistoryCard";
import { Navbar } from "../../components/Navbar";

import { mockHistoryTrainings } from "../../mocks/mockData";

export function History() {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);

    const weekday = date.toLocaleDateString("pt-BR", {
      weekday: "short",
    });

    const day = date.getDate();

    const month = date.toLocaleDateString("pt-BR", {
      month: "short",
    });

    return `${weekday} - ${day} de ${month}`;
  };

  return (
    <>
      <Container>
        <Row typeRow="row-space">
          <Logo />
          <MeatballsMenu />
        </Row>
        <h2>Histórico</h2>

        {mockHistoryTrainings.map((historyTraining) => (
          <TrainingHistoryCard
            key={historyTraining.id}
            id={historyTraining.id}
            trainingName={historyTraining.trainingName}
            image={historyTraining.image}
            alt={historyTraining.alt}
            finishedAt={formatDate(historyTraining.finishedAt)}
            muscleGroups={historyTraining.muscleGroups}
          />
        ))}
      </Container>
      <Navbar />
    </>
  );
}
