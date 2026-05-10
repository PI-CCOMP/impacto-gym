import { Container } from "../../components/Container";
import { Logo } from "../../components/Logo";
import { MeatballsMenu } from "../../components/MeatballsMenu";
import { Row } from "../../components/Row";
import { TrainingHistoryCard } from "../../components/TrainingHistoryCard";
import { Navbar } from "../../components/Navbar";

import { mockHistoryTrainings } from "../../mocks/mockData";

import { formatDateWeekday } from "../../utils/formatDate";

export function History() {
  return (
    <>
      <Container>
        <Row typeRow="row-space">
          <Logo />
          <MeatballsMenu />
        </Row>
        <h1>Histórico</h1>

        {mockHistoryTrainings.map((historyTraining) => (
          <TrainingHistoryCard
            key={historyTraining.id}
            id={historyTraining.id}
            trainingName={historyTraining.trainingName}
            image={historyTraining.image}
            alt={historyTraining.alt}
            finishedAt={formatDateWeekday(historyTraining.finishedAt)}
            muscleGroups={historyTraining.muscleGroups}
          />
        ))}
      </Container>
      <Navbar />
    </>
  );
}
