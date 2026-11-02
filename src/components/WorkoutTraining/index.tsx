import { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import { Check } from "lucide-react";
import { TimeAdjust } from "../TimeAdjust";

type Serie = {
  series: number;
  kg: number;
  reps: number;
};

type SerieValues = {
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
    reps: number,
  ) => void | boolean | Promise<void | boolean>;
  onSerieUnchecked?: (
    exerciseIndex: number,
    serieIndex: number,
    kg: number,
  ) => void | boolean | Promise<void | boolean>;
  disableUncheck?: boolean;
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
    new Notification("Descanso encerrado!", {
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
  disableUncheck = false,
}: WorkoutTrainingProps) {
  const [checkedRows, setCheckedRows] = useState<number[]>(initialChecked);
  const [inputError, setInputError] = useState("");
  const [updatingRows, setUpdatingRows] = useState<number[]>([]);
  const [seriesValues, setSeriesValues] = useState<Record<number, SerieValues>>(
    {},
  );
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

  useEffect(() => {
    setCheckedRows(initialChecked);
  }, [initialChecked]);

  const toggleRow = async (serieIndex: number) => {
    if (!trainingActive || updatingRows.includes(serieIndex)) return;
    setUpdatingRows((previous) => [...previous, serieIndex]);
    try {
      if (checkedRows.includes(serieIndex)) {
        if (disableUncheck) return;
        const removed = await onSerieUnchecked?.(
          exerciseIndex,
          serieIndex,
          seriesValues[serieIndex]?.kg ?? exercises[serieIndex].kg,
        );
        if (removed === false) return;
        setCheckedRows((prev) => prev.filter((i) => i !== serieIndex));
        stopCountdown();
      } else {
        const values = seriesValues[serieIndex] ?? exercises[serieIndex];
        if (
          !Number.isFinite(values.kg) ||
          values.kg < 0 ||
          values.kg > 9999.99 ||
          !Number.isInteger(values.reps) ||
          values.reps < 1 ||
          values.reps > 999
        ) {
          setInputError("Informe carga e repetições válidas antes de marcar a série.");
          return;
        }
        setInputError("");
        const saved = await onSerieChecked?.(
          exerciseIndex,
          serieIndex,
          values.kg,
          values.reps,
        );
        if (saved === false) return;
        setCheckedRows((prev) => [...prev, serieIndex]);
        startCountdown(restTime);
      }
    } finally {
      setUpdatingRows((previous) =>
        previous.filter((index) => index !== serieIndex),
      );
    }
  };

  return (
    <div className={styles.wrapper}>
      {inputError && <p role="alert">{inputError}</p>}
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
              <td>
                {trainingActive ? (
                  <input
                    type="number"
                    aria-label={`Carga realizada na série ${ex.series}`}
                    min={0}
                    max={9999.99}
                    step="0.5"
                    value={seriesValues[i]?.kg ?? ex.kg}
                    onChange={(event) =>
                      setSeriesValues((previous) => ({
                        ...previous,
                        [i]: {
                          kg: Number(event.target.value),
                          reps: previous[i]?.reps ?? ex.reps,
                        },
                      }))
                    }
                    className={styles.valueInput}
                  />
                ) : (
                  ex.kg
                )}
              </td>
              <td>
                {trainingActive ? (
                  <input
                    type="number"
                    aria-label={`Repetições realizadas na série ${ex.series}`}
                    min={1}
                    max={999}
                    step={1}
                    value={seriesValues[i]?.reps ?? ex.reps}
                    onChange={(event) =>
                      setSeriesValues((previous) => ({
                        ...previous,
                        [i]: {
                          kg: previous[i]?.kg ?? ex.kg,
                          reps: Number(event.target.value),
                        },
                      }))
                    }
                    className={styles.valueInput}
                  />
                ) : (
                  ex.reps
                )}
              </td>
              {trainingActive && (
                <td>
                  <input
                    type="checkbox"
                    checked={checkedRows.includes(i)}
                    disabled={
                      updatingRows.includes(i) ||
                      (disableUncheck && checkedRows.includes(i))
                    }
                    onChange={() => void toggleRow(i)}
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
