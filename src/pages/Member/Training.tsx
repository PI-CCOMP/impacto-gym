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
} from "../../utils/activeTraining";

import { mockTrainings } from "../../mocks/mockData";

import { Dumbbell } from "lucide-react";

type CheckedSerie = {
  exerciseIndex: number;
  serieIndex: number;
  kg: number;
};

export function Training() {
  const { idTreino } = useParams();
  const navigate = useNavigate();

  const training = mockTrainings.find((t) => t.id === idTreino);
  const savedRef = useRef(getActiveTraining());
  const saved = savedRef.current;
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

  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleFinish = () => {
    if (checkedSeries.length === 0) {
      setShowErrorToast(true);
      return;
    }

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
    <Container>
      <PageHeader>{training.trainingName}</PageHeader>

      <TrainingHeader
        author={training.author}
        muscleGroups={training.muscleGroups}
        duration={duration}
        totalVolume={totalVolume}
        trainingActive={trainingActive}
      />

      {!trainingActive && (
        <Button onClick={handleStart} style={{ marginTop: 0 }}>
          Iniciar
        </Button>
      )}

      <h2>Exercícios</h2>

      {training.exercises.map((exercise, index) => (
        <>
          <ExerciseCard
            key={`card-${index}`}
            id={exercise.id}
            exerciseName={exercise.exerciseName}
            image={exercise.image}
            alt={exercise.alt}
            onClick={() => navigate(`/exercicio/${exercise.id}`)}
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

      {trainingActive && (
        <Button onClick={handleFinish}>Finalizar Treino</Button>
      )}

      {showErrorToast && (
        <Toast
          message="O treino não poderá ser finalizado. Para finalizar o treino você precisa preencher pelo menos uma linha da tabela."
          icon={<Dumbbell size={32} />}
          onClose={() => setShowErrorToast(false)}
        />
      )}

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
              navigate(`/treino/${savedRef.current?.id}`);
            }}
          >
            Continuar
          </Button>
          <ButtonStroke onClick={handleConfirmSwitch}>Encerrar</ButtonStroke>
          {/* colocar confirmação para encerrar treino na home */}
        </Toast>
      )}
    </Container>
  );
}
