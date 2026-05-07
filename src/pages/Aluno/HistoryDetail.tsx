import { useParams } from "react-router-dom";

import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { ExerciseCard } from "../../components/ExerciseCard";
import { TrainingHeader } from "../../components/TrainingHeader";
import { WorkoutTraining } from "../../components/WorkoutTraining";

import { mockHistoryTrainings } from "../../mocks/mockData";

export function HistoryDetail() {
  const { id } = useParams();
  const training = mockHistoryTrainings.find((t) => t.id === id);

  if (!training) return <p>Treino não encontrado.</p>;

  return (
    <>
      <Container>
        <PageHeader>{training.trainingName}</PageHeader>

        <TrainingHeader
          author={training.author}
          muscleGroups={training.muscleGroups}
          duration={training.duration}
          totalVolume={training.totalVolume}
          trainingActive={false}
          showStats={true}
        />

        {training.exercises.map((exercise, index) => (
          <>
            <ExerciseCard
              key={`card-${index}`}
              id={exercise.id}
              exerciseName={exercise.exerciseName}
              image={exercise.image}
              alt={exercise.alt}
            />
            <WorkoutTraining
              exerciseIndex={index}
              trainingActive={false}
              exercises={exercise.series}
            />
          </>
        ))}
      </Container>
    </>
  );
}
