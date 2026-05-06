import { useState } from "react";
import { Dumbbell } from "lucide-react";

import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { Toast } from "../../components/Toast";
import { Button } from "../../components/Button";
import { ButtonStroke } from "../../components/ButtonStroke";
import { HelpRequestCard } from "../../components/HelpRequestCard";

import { mockTrainings } from "../../mocks/mockData";

type HelpRequest = {
  id: string;
  trainingId: string;
  exerciseId: string;
  requestedAt: number;
};

const mockHelpRequests: HelpRequest[] = [
  {
    id: "hr1",
    trainingId: "1",
    exerciseId: "1",
    requestedAt: new Date("2026-09-13T16:00:00").getTime(),
  },
  {
    id: "hr2",
    trainingId: "1",
    exerciseId: "2",
    requestedAt: new Date("2026-09-13T16:15:00").getTime(),
  },
];

export function HelpRequest() {
  const [requests, setRequests] = useState<HelpRequest[]>(mockHelpRequests);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

  const getRequestData = (req: HelpRequest) => {
    const training = mockTrainings.find((t) => t.id === req.trainingId);
    const exercise = training?.exercises.find((e) => e.id === req.exerciseId);
    return { training, exercise };
  };

  const handleRemoveClick = (id: string) => {
    setPendingRemoveId(id);
  };

  const handleConfirmRemove = () => {
    setRequests((prev) => prev.filter((r) => r.id !== pendingRemoveId));
    setPendingRemoveId(null);
  };

  const handleCancelRemove = () => {
    setPendingRemoveId(null);
  };

  return (
    <Container>
      <PageHeader>Pedido de Ajuda</PageHeader>

      <h2>Exercício(s) que você pediu auxílio</h2>

      {requests.length === 0 && <p>Nenhum pedido de auxílio em andamento.</p>}

      {requests.map((req) => {
        const { training, exercise } = getRequestData(req);
        if (!training || !exercise) return null;

        return (
          <HelpRequestCard
            key={req.id}
            trainingName={training.trainingName}
            exerciseName={exercise.exerciseName}
            image={exercise.image}
            alt={exercise.alt}
            requestedAt={req.requestedAt}
            onRemove={() => handleRemoveClick(req.id)}
          />
        );
      })}

      {pendingRemoveId &&
        (() => {
          const req = requests.find((r) => r.id === pendingRemoveId);
          if (!req) return null;
          const { exercise } = getRequestData(req);

          return (
            <Toast
              message="Deseja cancelar o pedido de auxílio para "
              highlight={exercise?.exerciseName}
              icon={<Dumbbell />}
              duration={999999}
              onClose={handleCancelRemove}
            >
              <Button onClick={handleCancelRemove}>Cancelar</Button>
              <ButtonStroke onClick={handleConfirmRemove}>
                Confirmar
              </ButtonStroke>
            </Toast>
          );
        })()}
    </Container>
  );
}
