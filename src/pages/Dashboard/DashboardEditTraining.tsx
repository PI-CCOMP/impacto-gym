import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, X, Check, Edit2 } from "lucide-react";

import { DashboardGrid } from "../../components/DashboardGrid";
import { SideMenu } from "../../components/SideMenu";
import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { ActionButton } from "../../components/ActionButton";
import { DashboardRow } from "../../components/DashboardRow";
import { Input } from "../../components/Input/input";
import { InputCheckbox } from "../../components/InputCheckbox";
import { ExerciseCard } from "../../components/ExerciseCard";
import { Pagination } from "../../components/Pagination";
import { Button } from "../../components/Button";
import { ButtonStroke } from "../../components/ButtonStroke";
import { ExerciseConfigModal } from "../../components/ExerciseConfigModal.tsx";
import { QuickEditModal } from "../../components/QuickEditModal";
import { Toast } from "../../components/Toast";

import {
  mockTrainings,
  mockExercises,
  mockLoggedUser,
} from "../../mocks/mockData";

const MUSCLE_GROUPS = [
  "Peitoral",
  "Costas",
  "Pernas",
  "Ombros",
  "Bíceps",
  "Tríceps",
  "Abdômen",
];

export function DashboardEditTraining() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Busca o treino inicial nos mocks
  const training = mockTrainings.find((t) => t.id === id);

  // Estados dos dados
  const [trainingName, setTrainingName] = useState(
    training?.trainingName ?? "",
  );
  const [selectedExercises, setSelectedExercises] = useState<string[]>(
    training?.exercises.map((ex) => ex.id) ?? [],
  );

  // Estados de Busca e Filtro
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [selectedExerciseMuscles, setSelectedExerciseMuscles] = useState<
    string[]
  >([]);
  const [exercisePage, setExercisePage] = useState(1);
  const exercisePageSize = 6;

  // Estados de Modais e Toasts
  const [configuringExercise, setConfiguringExercise] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  if (!training) {
    return (
      <DashboardGrid>
        <SideMenu />
        <Container>
          <PageHeader onBack={() => navigate(-1)}>
            Treino não encontrado
          </PageHeader>
        </Container>
      </DashboardGrid>
    );
  }

  // Lógica de Filtro
  const filteredExercises = useMemo(() => {
    return mockExercises.filter((ex) => {
      const matchesSearch = ex.exerciseName
        .toLowerCase()
        .includes(exerciseSearch.toLowerCase());
      const matchesMuscle =
        selectedExerciseMuscles.length === 0 ||
        selectedExerciseMuscles.includes(ex.muscleGroup);
      return matchesSearch && matchesMuscle;
    });
  }, [exerciseSearch, selectedExerciseMuscles]);

  const paginatedExercises = filteredExercises.slice(
    (exercisePage - 1) * exercisePageSize,
    exercisePage * exercisePageSize,
  );

  const toggleExerciseMuscle = (muscle: string) => {
    setSelectedExerciseMuscles((prev) =>
      prev.includes(muscle)
        ? prev.filter((m) => m !== muscle)
        : [...prev, muscle],
    );
  };

  const handleSaveEdit = () => {
    if (selectedExercises.length === 0) {
      setErrorMessage("Selecione pelo menos um exercício.");
      return;
    }
    console.log("Treino Editado:", {
      id: training.id,
      trainingName,
      selectedExercises,
    });
    setShowSuccessToast(true);
    setTimeout(() => navigate(-1), 2000);
  };

  const canEdit =
    mockLoggedUser.role === "admin" || mockLoggedUser.role === "instructor";

  return (
    <DashboardGrid>
      <SideMenu />
      <Container style={{ paddingTop: "var(--size-sm)" }}>
        <DashboardRow variant="sideBySide">
          <PageHeader onBack={() => navigate(-1)}>
            {training.trainingName}
          </PageHeader>
          {canEdit && (
            <ActionButton
              variant="edit"
              icon={<Edit2 size={16} />}
              onClick={() => setShowNameModal(true)}
            />
          )}
        </DashboardRow>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--size-lg)",
          }}
        >
          {/* DashboardRow envolvendo Input e Checkboxes */}
          <DashboardRow>
            <Input
              type="text"
              id="exercise-search"
              name="exercise-search"
              placeholder="Buscar exercício..."
              leftIcon={<Search />}
              value={exerciseSearch}
              onChange={(e) => {
                setExerciseSearch(e.target.value);
                setExercisePage(1);
              }}
            />
            {MUSCLE_GROUPS.map((m) => (
              <InputCheckbox
                key={m}
                labelText={m}
                checked={selectedExerciseMuscles.includes(m)}
                onChange={() => toggleExerciseMuscle(m)}
              />
            ))}
          </DashboardRow>

          {/* Grid de Exercícios */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "var(--size-md)",
            }}
          >
            {paginatedExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                id={exercise.id}
                image={exercise.image}
                alt={exercise.alt}
                exerciseName={exercise.exerciseName}
                selected={selectedExercises.includes(exercise.id)}
                onClick={() => {
                  if (selectedExercises.includes(exercise.id)) {
                    setSelectedExercises((prev) =>
                      prev.filter((exId) => exId !== exercise.id),
                    );
                  } else {
                    setConfiguringExercise({
                      id: exercise.id,
                      name: exercise.exerciseName,
                    });
                  }
                }}
              />
            ))}
          </div>

          <Pagination
            total={filteredExercises.length}
            page={exercisePage}
            pageSize={exercisePageSize}
            onPageChange={setExercisePage}
            onPageSizeChange={() => {}}
          />

          {/* Botões de Ação: Cancelar (Button) primeiro, Salvar (ButtonStroke) depois à direita */}
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
            <ButtonStroke onClick={handleSaveEdit}>
              Salvar Alterações
            </ButtonStroke>
          </div>
        </div>

        {/* Modais */}
        {configuringExercise && (
          <ExerciseConfigModal
            exerciseName={configuringExercise.name}
            onSave={(series) => {
              setSelectedExercises((prev) => [...prev, configuringExercise.id]);
              setConfiguringExercise(null);
            }}
            onClose={() => setConfiguringExercise(null)}
            onError={(msg) => setErrorMessage(msg)}
          />
        )}

        {showNameModal && (
          <QuickEditModal
            name={trainingName}
            onSave={(newName) => {
              setTrainingName(newName);
              setShowNameModal(false);
            }}
            onClose={() => setShowNameModal(false)}
          />
        )}

        {errorMessage && (
          <Toast
            message={errorMessage}
            icon={<X />}
            onClose={() => setErrorMessage(null)}
          />
        )}

        {showSuccessToast && (
          <Toast
            message="alterado com sucesso!"
            highlight="Treino"
            highlightPosition="before"
            icon={<Check />}
            onClose={() => setShowSuccessToast(false)}
          />
        )}
      </Container>
    </DashboardGrid>
  );
}
