import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { ExerciseCard } from "../../components/ExerciseCard";
import { TrainingHeader } from "../../components/TrainingHeader";
import { WorkoutTraining } from "../../components/WorkoutTraining";
import { apiGet } from "../../services/api";
import { formatDateWeekday } from "../../utils/formatDate";
import { normalizeMuscleGroups } from "../../utils/training";
import exerciseSupino from "../../assets/img/exercise/supino.gif";

type HistoricalExercise = {
  id_exercicio: number;
  nome: string;
  foto_url: string | null;
  series: Array<{
    numero: number;
    carga_real: number;
    repeticoes: number;
  }>;
};
type HistoricalTraining = {
  nome_treino: string;
  grupos_musculares: string[];
  autor: string;
  finalizado_em: string;
  duracao_segundos: number;
  volume_total: number;
  exercicios: HistoricalExercise[];
};

function displayGroup(group: string): string {
  if (group === "Bracos") return "Braços";
  if (group === "Abdomen") return "Abdômen";
  return group;
}

export function HistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState<HistoricalTraining | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    if (!id) {
      setError("Histórico não encontrado.");
      return () => {
        active = false;
      };
    }

    apiGet<HistoricalTraining>(`/historico/meu/${id}`)
      .then((result) => {
        if (active) {
          setTraining({
            ...result,
            grupos_musculares: normalizeMuscleGroups(
              result.grupos_musculares,
            ),
          });
        }
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
  }, [id]);

  if (error) {
    return (
      <Container>
        <PageHeader onBack={() => navigate(-1)}>Histórico</PageHeader>
        <p role="alert">{error}</p>
      </Container>
    );
  }
  if (!training) {
    return (
      <Container>
        <PageHeader onBack={() => navigate(-1)}>Histórico</PageHeader>
        <p role="status">Carregando histórico...</p>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader onBack={() => navigate(-1)}>{training.nome_treino}</PageHeader>
      <TrainingHeader
        author={training.autor}
        muscleGroups={training.grupos_musculares.map(displayGroup)}
        duration={Number(training.duracao_segundos)}
        totalVolume={Number(training.volume_total)}
        trainingActive={false}
        showStats
        finishedAt={formatDateWeekday(new Date(training.finalizado_em).getTime())}
      />

      {training.exercicios.map((exercise) => (
        <div key={exercise.id_exercicio}>
          <ExerciseCard
            id={String(exercise.id_exercicio)}
            exerciseName={exercise.nome}
            image={exercise.foto_url ?? exerciseSupino}
            alt={exercise.nome}
          />
          <WorkoutTraining
            exerciseIndex={exercise.id_exercicio}
            trainingActive={false}
            exercises={exercise.series.map((serie) => ({
              series: serie.numero,
              kg: Number(serie.carga_real),
              reps: serie.repeticoes,
            }))}
          />
        </div>
      ))}
      {training.exercicios.length === 0 && (
        <p>Não há séries disponíveis para este histórico.</p>
      )}
    </Container>
  );
}
