import { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import { Check } from "lucide-react";
import { TimeAdjust } from "../TimeAdjust";

type Serie = {
  series: number;
  kg: number;
  reps: number;
};

type WorkoutTrainingProps = {
  exerciseIndex: number;
  trainingActive: boolean;
  exercises?: Serie[];
  initialChecked?: number[];
  onSerieChecked?: (
    exerciseIndex: number,
    serieIndex: number,
    kg: number,
  ) => void;
  onSerieUnchecked?: (
    exerciseIndex: number,
    serieIndex: number,
    kg: number,
  ) => void;
};

const defaultExercises: Serie[] = [
  { series: 1, kg: 35, reps: 15 },
  { series: 2, kg: 35, reps: 15 },
];

function playBeep() {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  gain.gain.setValueAtTime(1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.8);
}

function sendNotification() {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Descanso encerrado! 💪", {
      body: "Hora da próxima série!",
      icon: "/favicon.ico",
    });
  }
}

export function WorkoutTraining({
  exerciseIndex,
  trainingActive,
  exercises = defaultExercises,
  initialChecked = [],
  onSerieChecked,
  onSerieUnchecked,
}: WorkoutTrainingProps) {
  const [checkedRows, setCheckedRows] = useState<number[]>(initialChecked);
  const [restTime, setRestTime] = useState(90);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = (seconds: number) => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(seconds);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownRef.current!);
          playBeep();
          sendNotification();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopCountdown = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(null);
  };

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const toggleRow = (serieIndex: number, kg: number) => {
    if (!trainingActive) return;

    if (checkedRows.includes(serieIndex)) {
      setCheckedRows((prev) => prev.filter((i) => i !== serieIndex));
      onSerieUnchecked?.(exerciseIndex, serieIndex, kg);
      stopCountdown();
    } else {
      setCheckedRows((prev) => [...prev, serieIndex]);
      onSerieChecked?.(exerciseIndex, serieIndex, kg);
      startCountdown(restTime);
    }
  };

  return (
    <div className={styles.wrapper}>
      <TimeAdjust
        initialTime={restTime}
        trainingActive={trainingActive}
        countdown={countdown}
        onConfirm={(t) => setRestTime(t)}
      />
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th>Série</th>
            <th>Kg</th>
            <th>Reps</th>
            {trainingActive && (
              <th>
                <Check className={styles.icon} />
              </th>
            )}
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {exercises.map((ex, i) => (
            <tr
              key={i}
              className={checkedRows.includes(i) ? styles.activeRow : ""}
            >
              <td>{ex.series}</td>
              <td>{ex.kg}</td>
              <td>{ex.reps}</td>
              {trainingActive && (
                <td>
                  <input
                    type="checkbox"
                    checked={checkedRows.includes(i)}
                    onChange={() => toggleRow(i, ex.kg)}
                    className={styles.checkbox}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
