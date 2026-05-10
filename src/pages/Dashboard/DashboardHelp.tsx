import { useState } from "react";
import { DashboardGrid } from "../../components/DashboardGrid";
import { SideMenu } from "../../components/SideMenu";
import { Container } from "../../components/Container";
import { DashboardHelpRequestCard } from "../../components/DashboardHelpRequestCard";

import {
  mockUsers,
  mockTrainings,
  mockHelpRequests,
  type HelpRequest,
} from "../../mocks/mockData";

export function DashboardHelp() {
  const [requests, setRequests] = useState<HelpRequest[]>(mockHelpRequests);

  function getRequestData(req: HelpRequest) {
    const user = mockUsers.find((u) => u.trainingIds?.includes(req.trainingId));
    const training = mockTrainings.find((t) => t.id === req.trainingId);
    const exercise = training?.exercises.find((e) => e.id === req.exerciseId);
    return { user, exercise };
  }

  function handleAccept(id: string) {
    // Em produção: await api.patch(`/help-requests/${id}`, { status: "accepted" })
    console.log("Aceitou solicitação:", id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <DashboardGrid>
      <SideMenu />
      <Container>
        <h1>Solicitação Auxílio</h1>

        {requests.length === 0 && (
          <p>Nenhuma solicitação de auxílio no momento.</p>
        )}

        <div>
          {requests.map((req) => {
            const { user, exercise } = getRequestData(req);
            return (
              <DashboardHelpRequestCard
                key={req.id}
                userName={user?.name ?? "Usuário desconhecido"}
                userImage={user?.image ?? ""}
                exerciseName={
                  exercise?.exerciseName ?? "Exercício desconhecido"
                }
                onAccept={() => handleAccept(req.id)}
              />
            );
          })}
        </div>
      </Container>
    </DashboardGrid>
  );
}
