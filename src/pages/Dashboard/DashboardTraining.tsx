import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";

import { DashboardGrid } from "../../components/DashboardGrid";
import { SideMenu } from "../../components/SideMenu";
import { Container } from "../../components/Container";
import { DashboardRow } from "../../components/DashboardRow";
import { Input } from "../../components/Input/input";
import { InputCheckbox } from "../../components/InputCheckbox";
import { TrainingCard } from "../../components/TrainingCard";
import { ExerciseCard } from "../../components/ExerciseCard";
import { Pagination } from "../../components/Pagination";
import { Line } from "../../components/Line";
import { Button } from "../../components/Button";
import { ExerciseConfigModal, type ExerciseConfiguration } from "../../components/ExerciseConfigModal";
import { QuickEditModal } from "../../components/QuickEditModal";
import {
  apiGet,
  apiGetAllPages,
  apiPostAuthed,
} from "../../services/api";
import { MUSCLE_GROUPS } from "../../utils/formOptions";
import { can } from "../../utils/permissions";
import { normalizeMuscleGroups } from "../../utils/training";
import { midiaExercicioPrivadaPorUrl } from "../../services/api";
import exerciseSupino from "../../assets/img/exercise/supino.gif";

type TrainingSummary = {
  id_treino: number;
  id_instrutor: number;
  nome: string;
  grupos_musculares: string[];
  autor: string;
  foto_primeiro_exercicio_url: string | null;
};
type TrainingSummaryResponse = Omit<TrainingSummary, "grupos_musculares"> & {
  grupos_musculares: unknown;
};
type ExerciseItem = {
  id_exercicio: number;
  nome: string;
  grupo_muscular: string;
  foto_url: string | null;
  video_url: string | null;
};
type SelectedExercise = {
  exercise: ExerciseItem;
  configuration: ExerciseConfiguration;
};

const groupValue: Record<string, string> = {
  "Braços": "Bracos",
  "Abdômen": "Abdomen",
};

function displayGroup(group: string): string {
  if (group === "Bracos") return "Braços";
  if (group === "Abdomen") return "Abdômen";
  return group;
}

function normalizeTraining(training: TrainingSummaryResponse): TrainingSummary {
  return {
    ...training,
    grupos_musculares: normalizeMuscleGroups(training.grupos_musculares),
  };
}

export function DashboardTraining() {
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState<TrainingSummary[]>([]);
  const [trainingImages, setTrainingImages] = useState<Record<number, string>>(
    {},
  );
  const [catalog, setCatalog] = useState<ExerciseItem[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [selectedExerciseMuscles, setSelectedExerciseMuscles] = useState<
    string[]
  >([]);
  const [exercisePage, setExercisePage] = useState(1);
  const exercisePageSize = 5;
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>(
    [],
  );
  const [configuringExercise, setConfiguringExercise] =
    useState<ExerciseItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createValidationError, setCreateValidationError] = useState("");

  useEffect(() => {
    if (!showSuccessToast) return;
    const timer = setTimeout(() => setShowSuccessToast(false), 3000);
    return () => clearTimeout(timer);
  }, [showSuccessToast]);

  useEffect(() => {
    let active = true;
    async function loadTrainingImages() {
      try {
        const images = await Promise.all(
          trainings.map(async (training) => [
            training.id_treino,
            await midiaExercicioPrivadaPorUrl(
              training.foto_primeiro_exercicio_url,
            ),
          ] as const),
        );
        if (active) {
          setTrainingImages(
            Object.fromEntries(
              images.filter(
                (entry): entry is readonly [number, string] =>
                  typeof entry[1] === "string",
              ),
            ),
          );
        }
      } catch (error) {
        if (active) {
          setErrorMessage(
            error instanceof Error
              ? `Não foi possível carregar a imagem do treino: ${error.message}`
              : "Não foi possível carregar a imagem do treino.",
          );
        }
      }
    }
    void loadTrainingImages();
    return () => {
      active = false;
    };
  }, [trainings]);

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        const [trainingResult, exerciseResult, user] = await Promise.all([
          apiGetAllPages<TrainingSummaryResponse>("/treinos"),
          apiGetAllPages<ExerciseItem>("/exercicios"),
          apiGet<{ id_usuario: number }>("/usuarios/eu"),
        ]);
        if (!active) return;
        setTrainings(trainingResult.map(normalizeTraining));
        setCatalog(exerciseResult);
        setCurrentUserId(user.id_usuario);
      } catch (error) {
        if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar treinos e exercícios.",
          );
        }
      }
    }
    void loadData();
    return () => {
      active = false;
    };
  }, []);

  function toggleMuscle(muscle: string) {
    setSelectedMuscles((previous) =>
      previous.includes(muscle)
        ? previous.filter((item) => item !== muscle)
        : [...previous, muscle],
    );
  }

  function toggleExerciseMuscle(muscle: string) {
    setSelectedExerciseMuscles((previous) =>
      previous.includes(muscle)
        ? previous.filter((item) => item !== muscle)
        : [...previous, muscle],
    );
    setExercisePage(1);
  }

  const filteredTrainings = trainings.filter((training) => {
    const matchesSearch = training.nome
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesMine =
      !onlyMine || training.id_instrutor === currentUserId;
    const matchesMuscle =
      selectedMuscles.length === 0 ||
      selectedMuscles.some((muscle) =>
        training.grupos_musculares.includes(groupValue[muscle] ?? muscle),
      );
    return matchesSearch && matchesMine && matchesMuscle;
  });

  const filteredExercises = useMemo(
    () =>
      catalog.filter((exercise) => {
        const matchesSearch = exercise.nome
          .toLowerCase()
          .includes(exerciseSearch.toLowerCase());
        const matchesMuscle =
          selectedExerciseMuscles.length === 0 ||
          selectedExerciseMuscles.includes(
            displayGroup(exercise.grupo_muscular),
          );
        return matchesSearch && matchesMuscle;
      }),
    [catalog, exerciseSearch, selectedExerciseMuscles],
  );
  const paginatedExercises = filteredExercises.slice(
    (exercisePage - 1) * exercisePageSize,
    exercisePage * exercisePageSize,
  );

  function handleCreateTraining() {
    if (selectedExercises.length < 3) {
      setCreateValidationError("Adicione pelo menos 3 exercícios ao treino.");
      return;
    }
    setCreateValidationError("");
    setShowNameModal(true);
  }

  async function saveTraining(name: string) {
    setCreating(true);
    setErrorMessage(null);
    try {
      await apiPostAuthed("/treinos", {
        nome: name,
        exercicios: selectedExercises.map(({ exercise, configuration }) => ({
          id_exercicio: exercise.id_exercicio,
          series: configuration.series,
          repeticoes: configuration.reps,
          carga_sugerida: configuration.kg,
          tempo_descanso: configuration.restSeconds,
        })),
      });
      const trainingResult =
        await apiGetAllPages<TrainingSummaryResponse>("/treinos");
      setTrainings(trainingResult.map(normalizeTraining));
      setShowNameModal(false);
      setCreateOpen(false);
      setSelectedExercises([]);
      setShowSuccessToast(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível criar o treino.",
      );
    } finally {
      setCreating(false);
    }
  }

  if (!can.viewTrainings) {
    return (
      <DashboardGrid>
        <SideMenu />
        <Container isDashboard>
          <h1>Acesso não autorizado.</h1>
        </Container>
      </DashboardGrid>
    );
  }

  return (
    <DashboardGrid>
      <SideMenu />
      <Container isDashboard>
        <h1>Treinos</h1>
        {loadError && <p role="alert">{loadError}</p>}
        {errorMessage && <p role="alert">{errorMessage}</p>}
        {showSuccessToast && (
          <p role="status">Treino criado com sucesso.</p>
        )}

        <DashboardRow>
          <Input
            type="text"
            id="training"
            name="training"
            placeholder="Treino"
            leftIcon={<Search />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {MUSCLE_GROUPS.map((muscle) => (
            <InputCheckbox
              key={muscle}
              labelText={muscle}
              checked={selectedMuscles.includes(muscle)}
              onChange={() => toggleMuscle(muscle)}
            />
          ))}
          {sessionStorage.getItem("perfil") === "admin" && (
            <InputCheckbox
              labelText="Meus Treinos"
              checked={onlyMine}
              onChange={() => setOnlyMine((previous) => !previous)}
            />
          )}
        </DashboardRow>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "var(--size-md)",
          }}
        >
          {filteredTrainings.map((training) => (
            <div
              key={training.id_treino}
              onClick={() => navigate(`/dashboard/treino/${training.id_treino}`)}
              style={{ cursor: "pointer" }}
            >
              <TrainingCard
                variant="dashboard"
                dataState="default"
                image={trainingImages[training.id_treino] ?? exerciseSupino}
                alt={training.nome}
                trainingName={training.nome}
                muscleGroups={training.grupos_musculares.map(displayGroup)}
              />
            </div>
          ))}
          {filteredTrainings.length === 0 && <p>Nenhum treino encontrado.</p>}
        </div>

        <Line />
        <div>
          <div
            onClick={() => setCreateOpen((previous) => !previous)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--size-sm)",
              cursor: "pointer",
            }}
          >
            <h2>Criar Treino</h2>
            <ChevronDown
              color="var(--secondary)"
              style={{
                transform: createOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </div>

          {createOpen && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleCreateTraining();
              }}
              style={{
                marginTop: "var(--size-md)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--size-md)",
              }}
            >
              <DashboardRow>
                <Input
                  type="text"
                  id="exercise-search"
                  name="exercise-search"
                  placeholder="Exercício"
                  leftIcon={<Search />}
                  value={exerciseSearch}
                  onChange={(event) => {
                    setExerciseSearch(event.target.value);
                    setExercisePage(1);
                  }}
                />
                {MUSCLE_GROUPS.map((muscle) => (
                  <InputCheckbox
                    key={muscle}
                    labelText={muscle}
                    checked={selectedExerciseMuscles.includes(muscle)}
                    onChange={() => toggleExerciseMuscle(muscle)}
                  />
                ))}
              </DashboardRow>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "var(--size-md)",
                  paddingTop: "var(--size-md)",
                }}
              >
                {paginatedExercises.map((exercise) => {
                  const selected = selectedExercises.some(
                    (item) => item.exercise.id_exercicio === exercise.id_exercicio,
                  );
                  return (
                    <ExerciseCard
                      key={exercise.id_exercicio}
                      id={String(exercise.id_exercicio)}
                      image={exercise.foto_url ?? exerciseSupino}
                      alt={exercise.nome}
                      exerciseName={exercise.nome}
                      selected={selected}
                      onClick={() => {
                        if (selected) {
                          setSelectedExercises((previous) =>
                            previous.filter(
                              (item) =>
                                item.exercise.id_exercicio !==
                                exercise.id_exercicio,
                            ),
                          );
                        } else {
                          setConfiguringExercise(exercise);
                        }
                      }}
                    />
                  );
                })}
                {filteredExercises.length === 0 && (
                  <p>Nenhum exercício encontrado.</p>
                )}
              </div>
              <Pagination
                total={filteredExercises.length}
                page={exercisePage}
                pageSize={exercisePageSize}
                onPageChange={setExercisePage}
                onPageSizeChange={() => {}}
              />
              <Button type="submit" style={{ alignSelf: "flex-start" }}>
                Criar Treino
              </Button>
              {createValidationError && (
                <p role="alert">{createValidationError}</p>
              )}
            </form>
          )}
        </div>

        {configuringExercise && (
          <ExerciseConfigModal
            exerciseName={configuringExercise.nome}
            onSave={(configuration) => {
              setSelectedExercises((previous) => [
                ...previous,
                { exercise: configuringExercise, configuration },
              ]);
              setCreateValidationError("");
              setConfiguringExercise(null);
            }}
            onClose={() => setConfiguringExercise(null)}
            onError={(message) => setErrorMessage(message)}
          />
        )}
        {showNameModal && (
          <QuickEditModal
            name=""
            title="Nome do treino"
            onSave={(name) => void saveTraining(name)}
            onClose={() => setShowNameModal(false)}
          />
        )}
        {creating && <p role="status">Salvando treino...</p>}
      </Container>
    </DashboardGrid>
  );
}
