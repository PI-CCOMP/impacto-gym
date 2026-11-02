import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, apiGet, apiPatchAuthed } from "../../services/api";

import { Container } from "../../components/Container";
import { Row } from "../../components/Row";
import { Logo } from "../../components/Logo";
import { MeatballsMenu } from "../../components/MeatballsMenu";
import { TrainingCard } from "../../components/TrainingCard";
import { Navbar } from "../../components/Navbar";
import { ActiveTrainingCard } from "../../components/ActiveTrainingCard";
import { Line } from "../../components/Line";
import { EmptyResultsCard } from "../../components/EmptyResultsCard";
import { Toast } from "../../components/Toast";
import { Button } from "../../components/Button";
import { ButtonStroke } from "../../components/ButtonStroke";
import { normalizeMuscleGroups } from "../../utils/training";
import { midiaExercicioPrivadaPorUrl } from "../../services/api";

import noDataImg from "../../assets/img/illustrations/undraw_no-data_ig65.svg";

import exerciseSupino from "../../assets/img/exercise/supino.gif";

type TrainingSummary = {
  id_aluno_treino: number;
  nome_treino: string;
  grupos_musculares: string[];
  autor: string;
  imagem: string;
};
type TrainingSummaryResponse = Omit<
  TrainingSummary,
  "grupos_musculares" | "imagem"
> & {
  grupos_musculares: unknown;
  foto_primeiro_exercicio_url: string | null;
};

type ActiveSession = {
  id_sessao: number;
  id_aluno_treino: number;
  nome_treino: string;
  series_marcadas: { id_aluno_treino_exercicio: number }[];
};

export function Home() {
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState<TrainingSummary[]>([]);
  const [studentName, setStudentName] = useState("");
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [totalSeries, setTotalSeries] = useState(0);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmToast, setShowConfirmToast] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadHome() {
      try {
        const [user, result] = await Promise.all([
          apiGet<{ nome: string }>("/usuarios/eu"),
          apiGet<{ dados: TrainingSummaryResponse[] }>("/treinos/meus"),
        ]);
        if (!active) return;
        setStudentName(user.nome);
        const trainingData = await Promise.all(
          result.dados.map(async (training) => ({
            ...training,
            grupos_musculares: normalizeMuscleGroups(
              training.grupos_musculares,
            ),
            imagem:
              (await midiaExercicioPrivadaPorUrl(
                training.foto_primeiro_exercicio_url,
              )) ?? exerciseSupino,
          })),
        );
        if (!active) return;
        setTrainings(trainingData);
        try {
          const session = await apiGet<ActiveSession>("/sessoes/ativa");
          if (!active) return;
          setActiveSession(session);
          const detail = await apiGet<{
            exercicios: { series: unknown[] }[];
          }>(`/treinos/${session.id_aluno_treino}/exercicios`);
          if (active) {
            setTotalSeries(
              detail.exercicios.reduce(
                (count, exercise) => count + exercise.series.length,
                0,
              ),
            );
          }
        } catch (error) {
          if (error instanceof ApiError && error.status === 404) return;
          throw error;
        }
      } catch (error) {
        if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar seus treinos.",
          );
        }
      }
    }
    void loadHome();
    return () => {
      active = false;
    };
  }, []);

  const handleEncerrarClick = () => {
    setShowConfirmToast(true);
  };

  const handleConfirmEncerrar = async () => {
    if (!activeSession) return;
    setSubmitting(true);
    setLoadError("");
    try {
      await apiPatchAuthed(
        `/sessoes/${activeSession.id_sessao}/abandonar`,
        {},
      );
      setActiveSession(null);
      setShowConfirmToast(false);
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Não foi possível encerrar o treino.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEncerrar = () => {
    setShowConfirmToast(false);
  };

  return (
    <>
      <Container>
        <Row typeRow="row-space">
          <Logo />
          <MeatballsMenu />
        </Row>
        <h1>Olá, {studentName}!</h1>
        {loadError && <p role="alert">{loadError}</p>}

        {activeSession && (
          <>
            <ActiveTrainingCard
              trainingId={String(activeSession.id_aluno_treino)}
              trainingName={activeSession.nome_treino}
              checkedCount={activeSession.series_marcadas.length}
              totalSeries={totalSeries}
              onFinish={handleEncerrarClick}
            />
            <Line />
          </>
        )}

        <h2>Selecione o seu treino</h2>

        {trainings.length === 0 ? (
          <EmptyResultsCard
            title="Nenhum treino encontrado"
            image={noDataImg}
            alt="Nenhum treino disponível"
            description="Você ainda não possui treinos cadastrados. Aguarde o instrutor configurar sua ficha."
          />
        ) : (
          trainings.map((training) => (
            <div
              key={training.id_aluno_treino}
              onClick={() =>
                navigate(`/treino/${training.id_aluno_treino}`)
              }
            >
              <TrainingCard
                dataState={
                  activeSession?.id_aluno_treino === training.id_aluno_treino
                    ? "current"
                    : ""
                }
                image={training.imagem}
                alt={training.nome_treino}
                trainingName={training.nome_treino}
                muscleGroups={training.grupos_musculares}
              />
            </div>
          ))
        )}
      </Container>

      {showConfirmToast && (
        <Toast
          message="Deseja encerrar o treino em andamento?"
          onClose={handleCancelEncerrar}
        >
          <Button onClick={handleCancelEncerrar} style={{ marginTop: 0 }}>
            Cancelar
          </Button>
          <ButtonStroke
            onClick={() => void handleConfirmEncerrar()}
            disabled={submitting}
          >
            Encerrar
          </ButtonStroke>
        </Toast>
      )}

      <Navbar />
    </>
  );
}
