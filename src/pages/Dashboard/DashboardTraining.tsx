import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, X, Check } from "lucide-react";

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
import { ExerciseConfigModal } from "../../components/ExerciseConfigModal.tsx";
import { QuickEditModal } from "../../components/QuickEditModal";
import { Toast } from "../../components/Toast";

import {
  mockTrainings,
  mockExercises,
  mockLoggedUser,
} from "../../mocks/mockData";

const MUSCLE_GROUPS = ["Peitoral", "Costas", "Braços", "Pernas", "Abdômen"];

export function DashboardTraining() {
  const navigate = useNavigate();

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

  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [configuringExercise, setConfiguringExercise] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const canView = mockLoggedUser.role !== "receptionist";

  function toggleMuscle(muscle: string) {
    setSelectedMuscles((prev) =>
      prev.includes(muscle)
        ? prev.filter((m) => m !== muscle)
        : [...prev, muscle],
    );
  }

  function toggleExerciseMuscle(muscle: string) {
    setSelectedExerciseMuscles((prev) =>
      prev.includes(muscle)
        ? prev.filter((m) => m !== muscle)
        : [...prev, muscle],
    );
    setExercisePage(1);
  }

  function handleCreateTraining() {
    if (selectedExercises.length < 3) {
      setErrorMessage("Adicione pelo menos 3 exercícios ao treino.");
      return;
    }
    setShowNameModal(true);
  }

  const filteredTrainings = mockTrainings.filter((t) => {
    const matchesSearch = t.trainingName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesMine = !onlyMine || t.author === mockLoggedUser.name;
    const matchesMuscle =
      selectedMuscles.length === 0 ||
      selectedMuscles.some((m) => t.muscleGroups.includes(m));
    return matchesSearch && matchesMine && matchesMuscle;
  });

  const filteredExercises = mockExercises.filter((e) => {
    const matchesSearch = e.exerciseName
      .toLowerCase()
      .includes(exerciseSearch.toLowerCase());
    const matchesMuscle =
      selectedExerciseMuscles.length === 0 ||
      selectedExerciseMuscles.includes(e.muscleGroup);
    return matchesSearch && matchesMuscle;
  });

  const paginatedExercises = filteredExercises.slice(
    (exercisePage - 1) * exercisePageSize,
    exercisePage * exercisePageSize,
  );

  if (!canView) {
    return (
      <DashboardGrid>
        <SideMenu />
        <Container>
          <h1>Acesso não autorizado.</h1>
        </Container>
      </DashboardGrid>
    );
  }

  return (
    <DashboardGrid>
      <SideMenu />
      <Container>
        <h1>Treinos</h1>

        <DashboardRow>
          <Input
            type="text"
            id="training"
            name="training"
            placeholder="Treino"
            leftIcon={<Search />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {MUSCLE_GROUPS.map((m) => (
            <InputCheckbox
              key={m}
              labelText={m}
              checked={selectedMuscles.includes(m)}
              onChange={() => toggleMuscle(m)}
            />
          ))}
          {mockLoggedUser.role !== "receptionist" && (
            <InputCheckbox
              labelText="Meus Treinos"
              checked={onlyMine}
              onChange={() => setOnlyMine((prev) => !prev)}
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
              key={training.id}
              onClick={() => navigate(`/dashboard/treino/${training.id}`)}
              style={{ cursor: "pointer" }}
            >
              <TrainingCard
                variant="dashboard"
                dataState="default"
                image={training.image}
                alt={training.alt}
                trainingName={training.trainingName}
                muscleGroups={training.muscleGroups}
              />
            </div>
          ))}
        </div>

        <Line />

        <div>
          <div
            onClick={() => setCreateOpen((prev) => !prev)}
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
              onSubmit={(e) => {
                e.preventDefault();
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

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "var(--size-md)",
                  paddingTop: "var(--size-md)",
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
                          prev.filter((id) => id !== exercise.id),
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
            </form>
          )}
        </div>

        {configuringExercise && (
          <ExerciseConfigModal
            exerciseName={configuringExercise.name}
            onSave={(series) => {
              setSelectedExercises((prev) =>
                prev.includes(configuringExercise.id)
                  ? prev
                  : [...prev, configuringExercise.id],
              );
              console.log(
                "Séries configuradas",
                configuringExercise.id,
                series,
              );
            }}
            onClose={() => setConfiguringExercise(null)}
            onError={(msg) => setErrorMessage(msg)}
          />
        )}

        {showNameModal && (
          <QuickEditModal
            name=""
            onSave={(trainingName) => {
              const muscleGroups = [
                ...new Set(
                  selectedExercises
                    .map(
                      (exId) =>
                        mockExercises.find((e) => e.id === exId)?.muscleGroup,
                    )
                    .filter(Boolean) as string[],
                ),
              ];
              console.log("Criar treino", {
                name: trainingName,
                exercises: selectedExercises,
                muscleGroups,
              });
              setShowNameModal(false);
              setCreateOpen(false);
              setSelectedExercises([]);
              setShowSuccessToast(true);
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
            message="criado com sucesso!"
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
