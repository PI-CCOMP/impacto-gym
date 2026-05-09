import { DashboardGrid } from "../../components/DashboardGrid";
import { SideMenu } from "../../components/SideMenu";
import { Container } from "../../components/Container";
import { DashboardHelpRequestCard } from "../../components/DashboardHelpRequestCard";

import {
  mockUsers,
  mockExercises,
  mockHelpRequests,
} from "../../mocks/mockData";

export function DashboardHelp() {
  const requestsData = [
    {
      id: "hr1",
      user: mockUsers.find((u) => u.name.includes("Rafael")),
      exercise: "Supino Reto",
    },
    {
      id: "hr2",
      user: mockUsers.find((u) => u.name.includes("Lucas")),
      exercise: "Leg Press",
    },
    {
      id: "hr3",
      user: mockUsers.find((u) => u.name.includes("Mariana")),
      exercise: "Remada Curvada",
    },
  ];

  const handleAccept = (id: string) => {
    console.log("Aceitou solicitação:", id);
  };

  return (
    <DashboardGrid>
      <SideMenu />
      <Container>
        <h1>Solicitação Auxílio</h1>

        <div>
          {requestsData.map((request) => (
            <DashboardHelpRequestCard
              key={request.id}
              userName={request.user?.name || "Usuário desconhecido"}
              userImage={request.user?.image}
              exerciseName={request.exercise}
              onAccept={() => handleAccept(request.id)}
            />
          ))}
        </div>
      </Container>
    </DashboardGrid>
  );
}
