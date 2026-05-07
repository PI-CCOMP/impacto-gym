import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Dumbbell } from "lucide-react";

import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { Line } from "../../components/Line";
import { Button } from "../../components/Button";
import { Toast } from "../../components/Toast";

type LocationState = {
  exerciseName?: string;
};

export function Help() {
  const navigate = useNavigate();
  const location = useLocation();
  const { exerciseName } = (location.state as LocationState) ?? {};

  const [showFinishToast, setShowFinishToast] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  const handleFinish = () => {
    // TODO: chamar API quando disponível
    // POST /api/help-request
    // body: { userName: user.name, exerciseName }
    setShowFinishToast(true);
  };

  const handleFinishToastClose = () => {
    setShowFinishToast(false);
    navigate(-1);
  };

  return (
    <Container>
      <PageHeader>Preciso de Ajuda</PageHeader>

      <b>O que são séries?</b>
      <p>Séries são grupos de repetições de um exercício. Ex: 4x</p>
      <b>O que são repetições?</b>
      <p>
        Repetições são o número de vezes que um exercício é realizado em uma
        série. Ex: 15 a 12
      </p>
      <Line />
      <h3>Ainda com dúvida?</h3>
      <p>Chame um instrutor para te guiar!</p>
      {exerciseName && (
        <p>
          Exercício: <b>{exerciseName}</b>
        </p>
      )}
      {/* <Button onClick={handleFinish} disabled={isLoading}>
          {isLoading ? "Enviando..." : "Chamar Instrutor"}
        </Button> */}

      <Button onClick={handleFinish}>Chamar Instrutor</Button>
      {showFinishToast && (
        <Toast
          message="enviada com sucesso!"
          highlight="Solicitação de Auxílio"
          icon={<Dumbbell size={32} />}
          onClose={handleFinishToastClose}
        />
      )}
    </Container>
  );
}
