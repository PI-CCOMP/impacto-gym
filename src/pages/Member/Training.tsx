import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { TrainingHeader } from "../../components/TrainingHeader";
import { ExerciseCard } from "../../components/ExerciseCard";
import { WorkoutTraining } from "../../components/WorkoutTraining";
import { Button } from "../../components/Button";
import { ButtonStroke } from "../../components/ButtonStroke";
import { Toast } from "../../components/Toast";
import {
  ApiError,
  apiDeleteAuthed,
  apiGet,
  apiPatchAuthed,
  apiPostAuthed,
} from "../../services/api";
import { Dumbbell } from "lucide-react";
import exerciseSupino from "../../assets/img/exercise/supino.gif";
import { normalizeMuscleGroups } from "../../utils/training";

type TrainingSerie = {
  id_aluno_treino_exercicio: number | string;
  numero: number;
  repeticoes: number;
  carga_sugerida: number;
  tempo_descanso: number;
  carga_ultima: number | string | null;
  repeticoes_ultimas: number | string | null;
};
type TrainingResponse = Omit<TrainingDetail, "grupos_musculares"> & {
  grupos_musculares: unknown;
};

type TrainingExercise = {
  id_exercicio: number;
  nome: string;
  foto_url: string | null;
  video_url: string | null;
  imagem_ativacao_muscular_url: string | null;
  grupo_muscular: string;
  series: TrainingSerie[];
};

type TrainingDetail = {
  id_aluno_treino: number;
  nome_treino: string;
  grupos_musculares: string[];
  autor: string;
  exercicios: TrainingExercise[];
};

type SessionMark = {
  id_aluno_treino_exercicio: number | string;
  numero_serie: number;
  carga_real: number;
  repeticoes_real: number | null;
};

type ActiveSession = {
  id_sessao: number | string;
  id_aluno_treino: number | string;
  nome_treino: string;
  iniciado_em: string;
  series_marcadas: SessionMark[];
};

function getIncompleteSeriesCount(
  training: TrainingDetail,
  session: ActiveSession,
): number {
  const markedSeries = new Set(
    session.series_marcadas.map(
      (mark) =>
        `${Number(mark.id_aluno_treino_exercicio)}:${Number(mark.numero_serie)}`,
    ),
  );
  return training.exercicios.reduce(
    (count, exercise) =>
      count +
      exercise.series.filter(
        (serie) =>
          !markedSeries.has(
            `${Number(serie.id_aluno_treino_exercicio)}:${Number(serie.numero)}`,
          ),
      ).length,
    0,
  );
}

export function Training() {
  const { idTreino } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState<TrainingDetail | null>(null);
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestError, setRequestError] = useState("");
  const [trainingActive, setTrainingActive] = useState(false);
  const [duration, setDuration] = useState(0);
  const [showFinishToast, setShowFinishToast] = useState(false);
  const [showSwitchToast, setShowSwitchToast] = useState(false);
  const [showIncompleteFinishToast, setShowIncompleteFinishToast] =
    useState(false);
  const [submitting, setSubmitting] = useState(false);
  const startedAtRef = useRef<number>(Date.now());
  const durationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let active = true;
    async function loadTraining() {
      setLoading(true);
      setRequestError("");
      setTrainingActive(false);
      setSession(null);
      setDuration(0);
      try {
        const detail = await apiGet<TrainingResponse>(
          `/treinos/${idTreino}/exercicios`,
        );
        if (!active) return;
        const normalizedDetail: TrainingDetail = {
          ...detail,
          id_aluno_treino: Number(detail.id_aluno_treino),
          grupos_musculares: normalizeMuscleGroups(detail.grupos_musculares),
          exercicios: detail.exercicios.map((exercise) => ({
            ...exercise,
            series: exercise.series.map((serie) => ({
              ...serie,
              id_aluno_treino_exercicio: Number(
                serie.id_aluno_treino_exercicio,
              ),
              numero: Number(serie.numero),
              repeticoes: Number(serie.repeticoes),
              carga_sugerida: Number(serie.carga_sugerida),
              tempo_descanso: Number(serie.tempo_descanso),
              carga_ultima:
                serie.carga_ultima === null
                  ? null
                  : Number(serie.carga_ultima),
              repeticoes_ultimas:
                serie.repeticoes_ultimas === null
                  ? null
                  : Number(serie.repeticoes_ultimas),
            })),
          })),
        };
        setTraining(normalizedDetail);
        try {
          const currentSession = await apiGet<ActiveSession>("/sessoes/ativa");
          if (!active) return;
          const normalizedSession: ActiveSession = {
            ...currentSession,
            id_sessao: Number(currentSession.id_sessao),
            id_aluno_treino: Number(currentSession.id_aluno_treino),
            series_marcadas: currentSession.series_marcadas.map((mark) => ({
              ...mark,
              id_aluno_treino_exercicio: Number(
                mark.id_aluno_treino_exercicio,
              ),
              numero_serie: Number(mark.numero_serie),
              carga_real: Number(mark.carga_real),
              repeticoes_real:
                mark.repeticoes_real === null
                  ? null
                  : Number(mark.repeticoes_real),
            })),
          };
          setSession(normalizedSession);
          if (
            Number(normalizedSession.id_aluno_treino) ===
            Number(normalizedDetail.id_aluno_treino)
          ) {
            setTrainingActive(true);
            startedAtRef.current = new Date(
              normalizedSession.iniciado_em,
            ).getTime();
            setDuration(
              Math.max(
                0,
                Math.floor((Date.now() - startedAtRef.current) / 1000),
              ),
            );
          }
        } catch (error) {
          if (!(error instanceof ApiError && error.status === 404)) throw error;
        }
      } catch (error) {
        if (active) {
          setRequestError(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar o treino.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadTraining();
    return () => {
      active = false;
      if (durationRef.current) clearInterval(durationRef.current);
    };
  }, [idTreino]);

  useEffect(() => {
    if (!trainingActive) return;
    durationRef.current = setInterval(() => {
      setDuration(
        Math.floor((Date.now() - startedAtRef.current) / 1000),
      );
    }, 1000);
    return () => {
      if (durationRef.current) clearInterval(durationRef.current);
    };
  }, [trainingActive]);

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  async function iniciarTreino() {
    if (!training) return false;
    setSubmitting(true);
    setRequestError("");
    try {
      const result = await apiPostAuthed<{ id: number; iniciado_em: string }>(
        "/sessoes",
        { id_aluno_treino: training.id_aluno_treino },
      );
      const newSession: ActiveSession = {
        id_sessao: result.id,
        id_aluno_treino: training.id_aluno_treino,
        nome_treino: training.nome_treino,
        iniciado_em: result.iniciado_em,
        series_marcadas: [],
      };
      setSession(newSession);
      startedAtRef.current = new Date(result.iniciado_em).getTime();
      setDuration(0);
      setTrainingActive(true);
      await requestNotificationPermission();
      return true;
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Não foi possível iniciar o treino.",
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStart() {
    if (
      session &&
      Number(session.id_aluno_treino) !== Number(training?.id_aluno_treino)
    ) {
      setShowSwitchToast(true);
      return;
    }
    if (!session) await iniciarTreino();
  }

  async function handleConfirmSwitch() {
    if (!session) return;
    setSubmitting(true);
    setRequestError("");
    try {
      await apiPatchAuthed(`/sessoes/${session.id_sessao}/abandonar`, {});
      setSession(null);
      setTrainingActive(false);
      setShowSwitchToast(false);
      await iniciarTreino();
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Não foi possível trocar de treino.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSerieChecked(
    exerciseIndex: number,
    serieIndex: number,
    carga: number,
    repeticoes: number,
  ): Promise<boolean> {
    if (!session || !training) return false;
    const serie = training.exercicios[exerciseIndex]?.series[serieIndex];
    if (!serie) return false;
    setRequestError("");
    try {
      await apiPostAuthed(
        `/sessoes/${session.id_sessao}/series`,
        {
          id_aluno_treino_exercicio: Number(
            serie.id_aluno_treino_exercicio,
          ),
          numero_serie: serie.numero,
          carga_real: carga,
          repeticoes_real: repeticoes,
        },
      );
      setSession((current) =>
        current
          ? {
              ...current,
              series_marcadas: [
                ...current.series_marcadas.filter(
                  (mark) =>
                    Number(mark.id_aluno_treino_exercicio) !==
                      Number(serie.id_aluno_treino_exercicio) ||
                    Number(mark.numero_serie) !== Number(serie.numero),
                ),
                {
                  id_aluno_treino_exercicio: Number(
                    serie.id_aluno_treino_exercicio,
                  ),
                  numero_serie: serie.numero,
                  carga_real: carga,
                  repeticoes_real: repeticoes,
                },
              ],
            }
          : current,
      );
      return true;
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Não foi possível registrar a série.",
      );
      return false;
    }
  }

  async function handleSerieUnchecked(
    exerciseIndex: number,
    serieIndex: number,
  ): Promise<boolean> {
    if (!session || !training) return false;
    const serie = training.exercicios[exerciseIndex]?.series[serieIndex];
    if (!serie) return false;
    setRequestError("");
    try {
      await apiDeleteAuthed(
        `/sessoes/${session.id_sessao}/series/${serie.id_aluno_treino_exercicio}/${serie.numero}`,
      );
      setSession((current) =>
        current
          ? {
              ...current,
              series_marcadas: current.series_marcadas.filter(
                (mark) =>
                  Number(mark.id_aluno_treino_exercicio) !==
                    Number(serie.id_aluno_treino_exercicio) ||
                  Number(mark.numero_serie) !== Number(serie.numero),
              ),
            }
          : current,
      );
      return true;
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Não foi possível desmarcar a série.",
      );
      return false;
    }
  }

  async function handleFinish(confirmIncomplete = false) {
    if (!session || !training) return;
    const incompleteSeriesCount = getIncompleteSeriesCount(training, session);
    if (incompleteSeriesCount > 0 && !confirmIncomplete) {
      setShowIncompleteFinishToast(true);
      return;
    }
    setShowIncompleteFinishToast(false);
    setSubmitting(true);
    setRequestError("");
    try {
      await apiPatchAuthed(
        `/sessoes/${session.id_sessao}/finalizar`,
        { duracao_segundos: duration },
      );
      setTrainingActive(false);
      setShowFinishToast(true);
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Não foi possível finalizar o treino.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Container><p>Carregando treino...</p></Container>;
  if (!training) {
    return (
      <Container>
        <PageHeader onBack={() => navigate("/inicio")}>Treino</PageHeader>
        <p role="alert">{requestError || "Treino não encontrado."}</p>
      </Container>
    );
  }

  const sessionIsThisTraining =
    Number(session?.id_aluno_treino) ===
    Number(training.id_aluno_treino);
  const incompleteSeriesCount = session
    ? getIncompleteSeriesCount(training, session)
    : 0;
  const totalVolume =
    sessionIsThisTraining && training && session
      ? session.series_marcadas.reduce((total, mark) => {
          const plannedSerie = training.exercicios
            .flatMap((exercise) => exercise.series)
            .find(
              (serie) =>
                Number(serie.id_aluno_treino_exercicio) ===
                  Number(mark.id_aluno_treino_exercicio) &&
                Number(serie.numero) === Number(mark.numero_serie),
            );
          const repetitions = Number(
            mark.repeticoes_real ?? plannedSerie?.repeticoes ?? 0,
          );
          return total + Number(mark.carga_real) * repetitions;
        }, 0)
      : 0;

  return (
    <Container>
      <PageHeader>{training.nome_treino}</PageHeader>
      {requestError && <p role="alert">{requestError}</p>}

      <TrainingHeader
        author={training.autor}
        muscleGroups={training.grupos_musculares}
        duration={duration}
        totalVolume={totalVolume}
        trainingActive={trainingActive}
      />

      {!sessionIsThisTraining && (
        <Button onClick={() => void handleStart()} disabled={submitting}>
          {submitting ? "Iniciando..." : "Iniciar"}
        </Button>
      )}

      <h2>Exercícios</h2>
      {training.exercicios.map((exercise, exerciseIndex) => {
        const initialChecked = exercise.series
          .map((serie, serieIndex) =>
            session?.series_marcadas.some(
              (mark) =>
                Number(mark.id_aluno_treino_exercicio) ===
                  Number(serie.id_aluno_treino_exercicio) &&
                Number(mark.numero_serie) === Number(serie.numero),
            )
              ? serieIndex
              : -1,
          )
          .filter((index) => index >= 0);
        return (
          <div key={exercise.id_exercicio}>
            <ExerciseCard
              id={String(exercise.id_exercicio)}
              exerciseName={exercise.nome}
              image={exercise.foto_url ?? exerciseSupino}
              alt={exercise.nome}
              onClick={() =>
                navigate(`/exercicio/${exercise.id_exercicio}`, {
                  state: {
                    exerciseName: exercise.nome,
                    idAlunoTreinoExercicio:
                      exercise.series[0]?.id_aluno_treino_exercicio,
                  },
                })
              }
            />
            <WorkoutTraining
              exerciseIndex={exerciseIndex}
              trainingActive={trainingActive}
              exercises={exercise.series.map((serie) => {
                const mark = sessionIsThisTraining
                  ? session?.series_marcadas.find(
                      (item) =>
                        Number(item.id_aluno_treino_exercicio) ===
                          Number(serie.id_aluno_treino_exercicio) &&
                        Number(item.numero_serie) === Number(serie.numero),
                    )
                  : undefined;
                return {
                  series: serie.numero,
                  kg: mark
                    ? Number(mark.carga_real)
                    : Number(serie.carga_ultima ?? serie.carga_sugerida),
                  reps: mark
                    ? Number(mark.repeticoes_real ?? serie.repeticoes)
                    : Number(
                        serie.repeticoes_ultimas ?? serie.repeticoes,
                      ),
                };
              })}
              initialChecked={initialChecked}
              onSerieChecked={handleSerieChecked}
              onSerieUnchecked={handleSerieUnchecked}
            />
          </div>
        );
      })}

      {sessionIsThisTraining && (
        <Button onClick={() => void handleFinish()} disabled={submitting}>
          {submitting ? "Finalizando..." : "Finalizar Treino"}
        </Button>
      )}

      {showIncompleteFinishToast && (
        <Toast
          message="Ainda há séries sem concluir. Deseja encerrar o treino mesmo assim?"
          highlight={`${incompleteSeriesCount} série(s) pendente(s).`}
          icon={<Dumbbell size={32} />}
          duration={999999}
          onClose={() => setShowIncompleteFinishToast(false)}
        >
          <Button
            onClick={() => setShowIncompleteFinishToast(false)}
            style={{ marginTop: 0 }}
          >
            Continuar treino
          </Button>
          <ButtonStroke
            onClick={() => void handleFinish(true)}
            disabled={submitting}
          >
            Encerrar mesmo assim
          </ButtonStroke>
        </Toast>
      )}

      {showFinishToast && (
        <Toast
          message="Treino finalizado"
          highlight={training.nome_treino}
          icon={<Dumbbell size={32} />}
          onClose={() => {
            setShowFinishToast(false);
            navigate("/inicio", { replace: true });
          }}
        />
      )}

      {showSwitchToast && (
        <Toast
          message="em andamento. Quer continuar ou encerrar?"
          highlight={session?.nome_treino}
          icon={<Dumbbell size={32} />}
          duration={999999}
          onClose={() => setShowSwitchToast(false)}
        >
          <Button
            onClick={() => {
              setShowSwitchToast(false);
              if (session) navigate(`/treino/${session.id_aluno_treino}`);
            }}
          >
            Continuar
          </Button>
          <ButtonStroke
            onClick={() => void handleConfirmSwitch()}
            disabled={submitting}
          >
            Encerrar
          </ButtonStroke>
        </Toast>
      )}
    </Container>
  );
}
