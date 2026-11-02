import { useEffect, useState } from "react";
import { DashboardGrid } from "../../components/DashboardGrid";
import { SideMenu } from "../../components/SideMenu";
import { Container } from "../../components/Container";
import { DashboardHelpRequestCard } from "../../components/DashboardHelpRequestCard";

import {
  apiGet,
  apiPatchAuthed,
  fotoPerfilPrivadaPorUrl,
} from "../../services/api";
import anonymousImg from "../../assets/img/profile/anonymous.png";

type HelpRequestItem = {
  id_solicitacao: number;
  aluno: { nome: string; foto_url: string | null };
  nome_exercicio: string;
  status: string;
  solicitado_em: string;
  alunoFoto: string;
};

export function DashboardHelp() {
  const [requests, setRequests] = useState<HelpRequestItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadRequests() {
      try {
        const result = await apiGet<{
          dados: Omit<HelpRequestItem, "alunoFoto">[];
        }>("/solicitacoes-auxilio/dashboard");
        let photoFailed = false;
        const items = await Promise.all(
          result.dados.map(async (request) => {
            try {
              return {
                ...request,
                alunoFoto:
                  (await fotoPerfilPrivadaPorUrl(request.aluno.foto_url)) ??
                  anonymousImg,
              };
            } catch {
              photoFailed = true;
              return { ...request, alunoFoto: anonymousImg };
            }
          }),
        );
        if (active) {
          setRequests(items);
          if (photoFailed) setError("Não foi possível carregar uma ou mais fotos dos alunos.");
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

  async function handleAccept(id: number) {
    setError("");
    try {
      await apiPatchAuthed(`/solicitacoes-auxilio/${id}/atender`, {});
      setRequests((prev) => prev.filter((request) => request.id_solicitacao !== id));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível atender a solicitação.",
      );
    }
  }

  return (
    <DashboardGrid>
      <SideMenu />
      <Container>
        <h1>Solicitação Auxílio</h1>
        {error && <p role="alert">{error}</p>}

        {requests.length === 0 && (
          <p>Nenhuma solicitação de auxílio no momento.</p>
        )}

        <div>
          {requests.map((req) => {
            return (
              <DashboardHelpRequestCard
                key={req.id_solicitacao}
                userName={req.aluno.nome}
                userImage={req.alunoFoto}
                exerciseName={req.nome_exercicio}
                onAccept={() => void handleAccept(req.id_solicitacao)}
              />
            );
          })}
        </div>
      </Container>
    </DashboardGrid>
  );
}
