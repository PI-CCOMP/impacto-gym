import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, X, Check } from "lucide-react";

import { DashboardGrid } from "../../components/DashboardGrid";
import { SideMenu } from "../../components/SideMenu";
import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { DashboardRow } from "../../components/DashboardRow";
import { Input } from "../../components/Input/input";
import { InputCheckbox } from "../../components/InputCheckbox";
import { ExerciseCard } from "../../components/ExerciseCard";
import { Pagination } from "../../components/Pagination";
import { Line } from "../../components/Line";
import { Button } from "../../components/Button";
import { ButtonStroke } from "../../components/ButtonStroke";
import { QuickEditModal } from "../../components/QuickEditModal";
import { Toast } from "../../components/Toast";
import {
  apiGet,
  apiGetAllPages,
  apiPutAuthed,
} from "../../services/api";
import { MUSCLE_GROUPS } from "../../utils/formOptions";
import { can } from "../../utils/permissions";
import exerciseSupino from "../../assets/img/exercise/supino.gif";

type ExerciseItem = {
  id_exercicio: number;
  nome: string;
  grupo_muscular: string;
  foto_url: string | null;
  video_url: string | null;
};
type SelectedExercise = {
  exercise: ExerciseItem;
  configuration: {
    series: number;
    kg: number;
    reps: number;
    restSeconds: number;
  };
};
type TrainingDetail = {
  id_treino: number;
  nome: string;
  exercicios: Array<
    ExerciseItem & {
      series: number;
      repeticoes: number;
      carga_sugerida: number;
      tempo_descanso: number;
    }
  >;
};

function displayGroup(group: string): string {
  if (group === "Bracos") return "Braços";
  if (group === "Abdomen") return "Abdômen";
  return group;
}

export function DashboardEditTraining() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainingName, setTrainingName] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>(
    [],
  );
  const [catalog, setCatalog] = useState<ExerciseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [selectedExerciseMuscles, setSelectedExerciseMuscles] = useState<
    string[]
  >([]);
  const [exercisePage, setExercisePage] = useState(1);
  const exercisePageSize = 6;
  const [showNameModal, setShowNameModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [saving, setSaving] = useState(false);
  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [training, exerciseResult] = await Promise.all([
        apiGet<TrainingDetail>(`/treinos/${id}`),
        apiGetAllPages<ExerciseItem>("/exercicios"),
      ]);
      setTrainingName(training.nome);
      setSelectedExercises(
        training.exercicios.map((exercise) => ({
          exercise,
          configuration: {
            series: exercise.series,
            reps: exercise.repeticoes,
            kg: Number(exercise.carga_sugerida),
            restSeconds: exercise.tempo_descanso,
          },
        })),
      );
      setCatalog(exerciseResult);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Não foi possível carregar o treino.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

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
  const selectedIds = new Set(
    selectedExercises.map(({ exercise }) => exercise.id_exercicio),
  );
  const availableExercises = paginatedExercises.filter(
    (exercise) => !selectedIds.has(exercise.id_exercicio),
  );

  function toggleExerciseMuscle(muscle: string) {
    setSelectedExerciseMuscles((previous) =>
      previous.includes(muscle)
        ? previous.filter((item) => item !== muscle)
        : [...previous, muscle],
    );
    setExercisePage(1);
  }

  function toggleTrainingExercise(exercise: ExerciseItem) {
    setSelectedExercises((previous) => {
      const selected = previous.some(
        (item) => item.exercise.id_exercicio === exercise.id_exercicio,
      );
      if (selected) {
        return previous.filter(
          (item) => item.exercise.id_exercicio !== exercise.id_exercicio,
        );
      }
      return [
        ...previous,
        {
          exercise,
          configuration: { series: 3, reps: 12, kg: 0, restSeconds: 60 },
        },
      ];
    });
  }

  async function saveTraining(name = trainingName) {
    if (!id) return;
    if (selectedExercises.length < 3) {
      setErrorMessage("O treino deve ter pelo menos 3 exercícios.");
      return;
    }
    setSaving(true);
    setErrorMessage(null);
    try {
      await apiPutAuthed(`/treinos/${id}`, {
        nome: name,
        exercicios: selectedExercises.map(({ exercise, configuration }) => ({
          id_exercicio: exercise.id_exercicio,
          series: configuration.series,
          repeticoes: configuration.reps,
          carga_sugerida: configuration.kg,
          tempo_descanso: configuration.restSeconds,
        })),
      });
      setShowNameModal(false);
      setShowSuccessToast(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Não foi possível salvar o treino.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (!can.editTraining) {
    return (
      <DashboardGrid>
        <SideMenu />
        <Container isDashboard>
          <PageHeader onBack={() => navigate(-1)}>Acesso não autorizado.</PageHeader>
        </Container>
      </DashboardGrid>
    );
  }

  if (loading) {
    return (
      <DashboardGrid>
        <SideMenu />
        <Container isDashboard>
          <p role="status">Carregando treino...</p>
        </Container>
      </DashboardGrid>
    );
  }

  return (
    <DashboardGrid>
      <SideMenu />
      <Container isDashboard>
        <DashboardRow variant="sideBySide">
          <PageHeader onBack={() => navigate(-1)}>{trainingName || "Editar treino"}</PageHeader>
        </DashboardRow>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--size-lg)" }}>
          <DashboardRow>
            <Input
              type="text"
              id="exercise-search"
              name="exercise-search"
              placeholder="Buscar exercício..."
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
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "var(--size-md)",
            }}
          >
            <h2>Escolhidos</h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "var(--size-md)",
            }}
          >
            {selectedExercises.map(({ exercise }) => (
              <ExerciseCard
                key={exercise.id_exercicio}
                id={String(exercise.id_exercicio)}
                image={exercise.foto_url ?? exerciseSupino}
                alt={exercise.nome}
                exerciseName={exercise.nome}
                selected
                onDoubleClick={() => toggleTrainingExercise(exercise)}
                onRemove={() => toggleTrainingExercise(exercise)}
              />
            ))}
            {selectedExercises.length === 0 && (
              <p>Nenhum exercício escolhido.</p>
            )}
          </div>

          <Line />
          <h2>Não escolhidos</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "var(--size-md)",
            }}
          >
            {availableExercises.map((exercise) => (
              <div key={exercise.id_exercicio}>
                <ExerciseCard
                  id={String(exercise.id_exercicio)}
                  image={exercise.foto_url ?? exerciseSupino}
                  alt={exercise.nome}
                  exerciseName={exercise.nome}
                  onClick={() => toggleTrainingExercise(exercise)}
                />
              </div>
            ))}
            {availableExercises.length === 0 && (
              <p>
                {filteredExercises.length === 0
                  ? "Nenhum exercício encontrado."
                  : "Todos os exercícios desta página já foram escolhidos."}
              </p>
            )}
          </div>

          <Pagination
            total={filteredExercises.length}
            page={exercisePage}
            pageSize={exercisePageSize}
            onPageChange={setExercisePage}
            onPageSizeChange={() => {}}
          />

          <p>{selectedExercises.length} exercício(s) selecionado(s).</p>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "var(--size-md)",
              marginTop: "var(--size-lg)",
            }}
          >
            <Button onClick={() => navigate(-1)} style={{ marginTop: 0 }}>
              Cancelar
            </Button>
            <ButtonStroke onClick={() => setShowNameModal(true)}>
              Salvar Alterações
            </ButtonStroke>
          </div>
        </div>

        {showNameModal && (
          <QuickEditModal
            name={trainingName}
            title="Nome do treino"
            onSave={(newName) => {
              setTrainingName(newName);
              void saveTraining(newName);
            }}
            onClose={() => setShowNameModal(false)}
          />
        )}
        {errorMessage && (
          <Toast message={errorMessage} icon={<X />} onClose={() => setErrorMessage(null)} />
        )}
        {showSuccessToast && (
          <Toast
            message="alterado com sucesso!"
            highlight="Treino"
            highlightPosition="before"
            icon={<Check />}
            onClose={() => {
              setShowSuccessToast(false);
              navigate(`/dashboard/treino/${id}`);
            }}
          />
        )}
        {saving && <p role="status">Salvando treino...</p>}
      </Container>
    </DashboardGrid>
  );
}
