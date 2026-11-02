import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Dumbbell } from "lucide-react";

import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { Line } from "../../components/Line";
import { Button } from "../../components/Button";
import { Toast } from "../../components/Toast";
import { apiPostAuthed } from "../../services/api";

type LocationState = {
  exerciseName?: string;
  idAlunoTreinoExercicio?: number;
};

export function Help() {
  const navigate = useNavigate();
  const location = useLocation();
  const { exerciseName } = (location.state as LocationState) ?? {};

  const [showFinishToast, setShowFinishToast] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async () => {
    if (!location.state || !("idAlunoTreinoExercicio" in location.state)) return;
    const requestState = location.state as LocationState;
    if (!requestState.idAlunoTreinoExercicio) {
      setRequestError("Não foi possível identificar o exercício do treino.");
      return;
    }
    setRequestError("");
    setIsLoading(true);
    try {
      await apiPostAuthed("/solicitacoes-auxilio", {
        id_aluno_treino_exercicio: requestState.idAlunoTreinoExercicio,
      });
      setShowFinishToast(true);
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a solicitação.",
      );
    } finally {
      setIsLoading(false);
    }
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
      {requestError && <p role="alert">{requestError}</p>}
      <Button
        onClick={() => void handleFinish()}
        disabled={isLoading || !("idAlunoTreinoExercicio" in (location.state ?? {}))}
      >
        {isLoading ? "Enviando..." : "Chamar Instrutor"}
      </Button>
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
