import { useEffect, useState } from "react";
import { Container } from "../../components/Container";
import { Logo } from "../../components/Logo";
import { MeatballsMenu } from "../../components/MeatballsMenu";
import { Row } from "../../components/Row";
import { TrainingHistoryCard } from "../../components/TrainingHistoryCard";
import { Navbar } from "../../components/Navbar";

import { formatDateWeekday } from "../../utils/formatDate";
import {
  apiGet,
  midiaExercicioPrivadaPorUrl,
} from "../../services/api";
import { normalizeMuscleGroups } from "../../utils/training";
import exerciseSupino from "../../assets/img/exercise/supino.gif";

type HistoryItem = {
  id_historico: number;
  nome_treino: string;
  grupos_musculares: string[];
  finalizado_em: string;
  foto_primeiro_exercicio_url: string | null;
  imagem: string;
};
type HistoryItemResponse = Omit<
  HistoryItem,
  "grupos_musculares" | "imagem"
> & {
  grupos_musculares: unknown;
};

export function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiGet<{ dados: HistoryItemResponse[] }>("/historico/meu")
      .then(async (result) => {
        const historyItems = await Promise.all(
          result.dados.map(async (item) => ({
              ...item,
              grupos_musculares: normalizeMuscleGroups(
                item.grupos_musculares,
              ),
              imagem:
                (await midiaExercicioPrivadaPorUrl(
                  item.foto_primeiro_exercicio_url,
                )) ?? exerciseSupino,
          })),
        );
        if (active) setHistory(historyItems);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar o histórico.",
          );
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Container>
        <Row typeRow="row-space">
          <Logo />
          <MeatballsMenu />
        </Row>
        <h1>Histórico</h1>
        {error && <p role="alert">{error}</p>}
        {!error && history.length === 0 && <p>Nenhum treino concluído nos últimos 30 dias.</p>}

        {history.map((historyTraining) => (
          <TrainingHistoryCard
            key={historyTraining.id_historico}
            id={String(historyTraining.id_historico)}
            trainingName={historyTraining.nome_treino}
            image={historyTraining.imagem}
            alt={historyTraining.nome_treino}
            finishedAt={formatDateWeekday(
              new Date(historyTraining.finalizado_em).getTime(),
            )}
            muscleGroups={historyTraining.grupos_musculares}
          />
        ))}
      </Container>
      <Navbar />
    </>
  );
}
