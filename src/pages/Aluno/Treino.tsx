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
  getActiveTraining,
  setActiveTraining,
  clearActiveTraining,
} from "../../utils/activeTrainig";

import { Dumbbell } from "lucide-react";
import supinoImg from "../../assets/img/supino-reto.jpg";

type CheckedSerie = {
  exerciseIndex: number;
  serieIndex: number;
  kg: number;
};

const mockTrainings = [
  {
    id: "1",
    trainingName: "Treino A",
    author: "Catarina",
    muscleGroups: ["Peitoral", "Abdômen"],
    exercises: [
      {
        exerciseName: "Supino Reto",
        image: supinoImg,
        alt: "Supino Reto",
        series: [
          { series: 1, kg: 40, reps: 12 },
          { series: 2, kg: 42, reps: 10 },
          { series: 3, kg: 45, reps: 8 },
        ],
      },
      {
        exerciseName: "Crucifixo",
        image: supinoImg,
        alt: "Crucifixo",
        series: [
          { series: 1, kg: 20, reps: 15 },
          { series: 2, kg: 22, reps: 12 },
        ],
      },
      {
        exerciseName: "Abdominal",
        image: supinoImg,
        alt: "Abdominal",
        series: [
          { series: 1, kg: 0, reps: 20 },
          { series: 2, kg: 0, reps: 20 },
          { series: 3, kg: 0, reps: 15 },
        ],
      },
    ],
  },
  {
    id: "2",
    trainingName: "Treino B",
    author: "Catarina",
    muscleGroups: ["Costas", "Bíceps"],
    exercises: [
      {
        exerciseName: "Remada",
        image: supinoImg,
        alt: "Remada",
        series: [
          { series: 1, kg: 50, reps: 10 },
          { series: 2, kg: 55, reps: 8 },
        ],
      },
      {
        exerciseName: "Puxada",
        image: supinoImg,
        alt: "Puxada",
        series: [
          { series: 1, kg: 60, reps: 10 },
          { series: 2, kg: 60, reps: 8 },
          { series: 3, kg: 55, reps: 8 },
        ],
      },
    ],
  },
  {
    id: "3",
    trainingName: "Treino C",
    author: "Catarina",
    muscleGroups: ["Pernas", "Glúteos"],
    exercises: [
      {
        exerciseName: "Agachamento",
        image: supinoImg,
        alt: "Agachamento",
        series: [
          { series: 1, kg: 80, reps: 10 },
          { series: 2, kg: 85, reps: 8 },
          { series: 3, kg: 90, reps: 6 },
        ],
      },
      {
        exerciseName: "Leg Press",
        image: supinoImg,
        alt: "Leg Press",
        series: [
          { series: 1, kg: 120, reps: 12 },
          { series: 2, kg: 130, reps: 10 },
        ],
      },
    ],
  },
];

export default function Training() {
  const { idTreino } = useParams();
  const navigate = useNavigate();

  const training = mockTrainings.find((t) => t.id === idTreino);
  const saved = getActiveTraining();
  const isResuming = saved?.id === idTreino && saved?.isActive;
  const isDifferentActive = saved?.isActive && saved?.id !== idTreino;

  const [trainingActive, setTrainingActive] = useState(isResuming ?? false);
  const [totalVolume, setTotalVolume] = useState(
    isResuming ? (saved?.totalVolume ?? 0) : 0,
  );
  const [checkedSeries, setCheckedSeries] = useState<CheckedSerie[]>(
    isResuming ? (saved?.checkedSeries ?? []) : [],
  );
  const [duration, setDuration] = useState(() => {
    if (isResuming && saved?.startedAt) {
      return Math.floor((Date.now() - saved.startedAt) / 1000);
    }
    return 0;
  });

  const startedAtRef = useRef<number>(
    isResuming && saved?.startedAt ? saved.startedAt : Date.now(),
  );
  const durationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [showFinishToast, setShowFinishToast] = useState(false);
  const [showSwitchToast, setShowSwitchToast] = useState(false);

  useEffect(() => {
    if (trainingActive) {
      durationRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startedAtRef.current) / 1000));
      }, 1000);
    } else {
      if (durationRef.current) clearInterval(durationRef.current);
    }
    return () => {
      if (durationRef.current) clearInterval(durationRef.current);
    };
  }, [trainingActive]);

  useEffect(() => {
    if (trainingActive && training) {
      setActiveTraining({
        id: training.id,
        trainingName: training.trainingName,
        isActive: true,
        startedAt: startedAtRef.current,
        checkedSeries,
        totalVolume,
      });
    }
  }, [trainingActive, checkedSeries, totalVolume]);

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  const handleStart = async () => {
    if (isDifferentActive) {
      setShowSwitchToast(true);
      return;
    }
    await requestNotificationPermission();
    startedAtRef.current = Date.now();
    setTrainingActive(true);
  };

  const handleConfirmSwitch = async () => {
    setShowSwitchToast(false);
    clearActiveTraining();
    await requestNotificationPermission();
    startedAtRef.current = Date.now();
    setCheckedSeries([]);
    setTotalVolume(0);
    setDuration(0);
    setTrainingActive(true);
  };

  const handleFinish = () => {
    setTrainingActive(false);
    clearActiveTraining();
    if (durationRef.current) clearInterval(durationRef.current);
    setShowFinishToast(true);
  };

  const handleFinishToastClose = () => {
    setShowFinishToast(false);
    navigate("/inicio");
  };

  const handleSerieChecked = (
    exerciseIndex: number,
    serieIndex: number,
    kg: number,
  ) => {
    setCheckedSeries((prev) => [...prev, { exerciseIndex, serieIndex, kg }]);
    setTotalVolume((prev) => prev + kg);
  };

  const handleSerieUnchecked = (
    exerciseIndex: number,
    serieIndex: number,
    kg: number,
  ) => {
    setCheckedSeries((prev) =>
      prev.filter(
        (s) =>
          !(s.exerciseIndex === exerciseIndex && s.serieIndex === serieIndex),
      ),
    );
    setTotalVolume((prev) => Math.max(0, prev - kg));
  };

  if (!training) {
    navigate("/inicio");
    return null;
  }

  return (
    <Container
      style={{ paddingBottom: "calc(var(--size-xl) + var(--size-lg))" }}
    >
      <PageHeader>{training.trainingName}</PageHeader>

      <TrainingHeader
        author={training.author}
        muscleGroups={training.muscleGroups}
        duration={duration}
        totalVolume={totalVolume}
        trainingActive={trainingActive}
      />

      <h2>Exercícios</h2>

      {training.exercises.map((exercise, index) => (
        <>
          <ExerciseCard
            key={`card-${index}`}
            exerciseName={exercise.exerciseName}
            image={exercise.image}
            alt={exercise.alt}
          />
          <WorkoutTraining
            key={`table-${index}`}
            exerciseIndex={index}
            trainingActive={trainingActive}
            exercises={exercise.series}
            initialChecked={checkedSeries
              .filter((s) => s.exerciseIndex === index)
              .map((s) => s.serieIndex)}
            onSerieChecked={handleSerieChecked}
            onSerieUnchecked={handleSerieUnchecked}
          />
        </>
      ))}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "var(--size-sm)",
          backgroundColor: "var(--background)",
          zIndex: 10,
        }}
      >
        {!trainingActive ? (
          <Button
            style={{ marginBottom: "var(--size-xl)" }}
            onClick={handleStart}
          >
            Iniciar
          </Button>
        ) : (
          <Button
            style={{ marginBottom: "var(--size-xl)" }}
            onClick={handleFinish}
          >
            Finalizar Treino
          </Button>
        )}
      </div>

      {showFinishToast && (
        <Toast
          message="Treino finalizado"
          highlight={training.trainingName}
          icon={<Dumbbell size={32} />}
          onClose={handleFinishToastClose}
        />
      )}

      {showSwitchToast && (
        <Toast
          message="em andamento. Quer continuar ou encerrar?"
          highlight={saved?.trainingName}
          icon={<Dumbbell size={32} />}
          duration={999999}
          onClose={() => setShowSwitchToast(false)}
        >
          <Button
            onClick={() => {
              setShowSwitchToast(false);
              navigate(`/treino/${saved?.id}`);
            }}
          >
            Continuar
          </Button>
          <ButtonStroke onClick={handleConfirmSwitch}>Encerrar</ButtonStroke>
        </Toast>
      )}
    </Container>
  );
}
