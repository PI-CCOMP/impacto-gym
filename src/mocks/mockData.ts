import supinoImg from "../assets/img/supino-reto.jpg";
import peitoImg from "../assets/img/peito.png";

// User

export const mockUser = {
  id: "u1",
  name: "Arthur",
};

// Exercises

export type Exercise = {
  id: string;
  exerciseName: string;
  image: string;
  alt: string;
  muscleGroupImage: string;
  series: { series: number; kg: number; reps: number }[];
};

export const mockExercises: Exercise[] = [
  {
    id: "1",
    exerciseName: "Supino Reto",
    image: supinoImg,
    alt: "Supino Reto",
    muscleGroupImage: peitoImg,
    series: [
      { series: 1, kg: 40, reps: 12 },
      { series: 2, kg: 42, reps: 10 },
      { series: 3, kg: 45, reps: 8 },
    ],
  },
  {
    id: "2",
    exerciseName: "Crucifixo",
    image: supinoImg,
    alt: "Crucifixo",
    muscleGroupImage: peitoImg,
    series: [
      { series: 1, kg: 20, reps: 15 },
      { series: 2, kg: 22, reps: 12 },
    ],
  },
  {
    id: "3",
    exerciseName: "Abdominal",
    image: supinoImg,
    alt: "Abdominal",
    muscleGroupImage: peitoImg,
    series: [
      { series: 1, kg: 0, reps: 20 },
      { series: 2, kg: 0, reps: 20 },
      { series: 3, kg: 0, reps: 15 },
    ],
  },
  {
    id: "4",
    exerciseName: "Remada",
    image: supinoImg,
    alt: "Remada",
    muscleGroupImage: peitoImg,
    series: [
      { series: 1, kg: 50, reps: 10 },
      { series: 2, kg: 55, reps: 8 },
    ],
  },
  {
    id: "5",
    exerciseName: "Puxada",
    image: supinoImg,
    alt: "Puxada",
    muscleGroupImage: peitoImg,
    series: [
      { series: 1, kg: 60, reps: 10 },
      { series: 2, kg: 60, reps: 8 },
      { series: 3, kg: 55, reps: 8 },
    ],
  },
  {
    id: "6",
    exerciseName: "Agachamento",
    image: supinoImg,
    alt: "Agachamento",
    muscleGroupImage: peitoImg,
    series: [
      { series: 1, kg: 80, reps: 10 },
      { series: 2, kg: 85, reps: 8 },
      { series: 3, kg: 90, reps: 6 },
    ],
  },
  {
    id: "7",
    exerciseName: "Leg Press",
    image: supinoImg,
    alt: "Leg Press",
    muscleGroupImage: peitoImg,
    series: [
      { series: 1, kg: 120, reps: 12 },
      { series: 2, kg: 130, reps: 10 },
    ],
  },
];

// Trainings

export type Training = {
  id: string;
  trainingName: string;
  author: string;
  image: string;
  alt: string;
  muscleGroups: string[];
  exercises: Exercise[];
};

export const mockTrainings: Training[] = [
  {
    id: "1",
    trainingName: "Treino A",
    author: "Catarina",
    image: supinoImg,
    alt: "Foto do treino A",
    muscleGroups: ["Peitoral", "Abdômen"],
    exercises: [
      mockExercises[0], // Supino Reto
      mockExercises[1], // Crucifixo
      mockExercises[2], // Abdominal
    ],
  },
  {
    id: "2",
    trainingName: "Treino B",
    author: "Catarina",
    image: supinoImg,
    alt: "Foto do treino B",
    muscleGroups: ["Costas", "Bíceps"],
    exercises: [
      mockExercises[3], // Remada
      mockExercises[4], // Puxada
    ],
  },
  {
    id: "3",
    trainingName: "Treino C",
    author: "Catarina",
    image: supinoImg,
    alt: "Foto do treino C",
    muscleGroups: ["Pernas", "Glúteos"],
    exercises: [
      mockExercises[5], // Agachamento
      mockExercises[6], // Leg Press
    ],
  },
];

// Helpers

export function exerciseBelongsToActiveTraining(
  exerciseId: string,
  activeTrainingId: string | undefined,
): boolean {
  if (!activeTrainingId) return false;
  const training = mockTrainings.find((t) => t.id === activeTrainingId);
  return training?.exercises.some((e) => e.id === exerciseId) ?? false;
}
