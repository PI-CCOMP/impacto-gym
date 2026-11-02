import { useEffect, useState } from "react";
import { Dumbbell } from "lucide-react";

import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { Toast } from "../../components/Toast";
import { Button } from "../../components/Button";
import { ButtonStroke } from "../../components/ButtonStroke";
import { HelpRequestCard } from "../../components/HelpRequestCard";

import {
  apiGet,
  apiPatchAuthed,
  midiaExercicioPrivadaPorUrl,
} from "../../services/api";

export function HelpRequest() {
  type RequestItem = {
    id_solicitacao: number;
    nome_treino: string;
    nome_exercicio: string;
    foto_exercicio_url: string | null;
    status: string;
    solicitado_em: string;
  };
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadRequests() {
      try {
        const result = await apiGet<{ dados: RequestItem[] }>(
          "/solicitacoes-auxilio/minhas",
        );
        const requestsWithImages = await Promise.all(
          result.dados.map(async (request) => ({
            ...request,
            foto_exercicio_url: await midiaExercicioPrivadaPorUrl(
              request.foto_exercicio_url,
            ),
          })),
        );
        if (active) {
          setRequests(requestsWithImages);
          setError("");
        }
      } catch (requestError: unknown) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar as solicitações.",
          );
        }
      }
    }

    void loadRequests();
    const intervalId = window.setInterval(() => void loadRequests(), 5000);
    window.addEventListener("focus", loadRequests);
    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", loadRequests);
    };
  }, []);

  const handleRemoveClick = (id: string) => {
    setPendingRemoveId(id);
  };

  const handleConfirmRemove = async () => {
    if (!pendingRemoveId) return;
    setSubmitting(true);
    setError("");
    try {
      await apiPatchAuthed(
        `/solicitacoes-auxilio/${pendingRemoveId}/cancelar`,
        {},
      );
      setRequests((prev) =>
        prev.filter((r) => String(r.id_solicitacao) !== pendingRemoveId),
      );
      setPendingRemoveId(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível cancelar a solicitação.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRemove = () => {
    setPendingRemoveId(null);
  };

  return (
    <Container>
      <PageHeader>Pedido de Ajuda</PageHeader>

      <h1>Exercício(s) que você pediu auxílio</h1>
      {error && <p role="alert">{error}</p>}

      {requests.length === 0 && <p>Nenhum pedido de auxílio em andamento.</p>}

      {requests.map((req) => {
        return (
          <HelpRequestCard
            key={req.id_solicitacao}
            trainingName={req.nome_treino}
            exerciseName={req.nome_exercicio}
            image={req.foto_exercicio_url}
            alt={req.nome_exercicio}
            requestedAt={new Date(req.solicitado_em).getTime()}
            onRemove={() => handleRemoveClick(String(req.id_solicitacao))}
          />
        );
      })}

      {pendingRemoveId &&
        (() => {
          const req = requests.find(
            (r) => String(r.id_solicitacao) === pendingRemoveId,
          );
          if (!req) return null;

          return (
            <Toast
          message={`Deseja cancelar o pedido de auxílio para ${req.nome_exercicio}?`}
          highlight={req.nome_exercicio}
              icon={<Dumbbell />}
              duration={999999}
              onClose={handleCancelRemove}
            >
              <Button onClick={handleCancelRemove}>Cancelar</Button>
              <ButtonStroke
                onClick={() => void handleConfirmRemove()}
                disabled={submitting}
              >
                {submitting ? "Cancelando..." : "Confirmar"}
              </ButtonStroke>
            </Toast>
          );
        })()}
    </Container>
  );
}
