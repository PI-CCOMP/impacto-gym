import { useState } from "react";
import styles from "./styles.module.css";

import { Check } from "lucide-react";
import { InputCheckbox } from "../InputCheckbox";

type WorkoutTrainingProps = {
  trainingActive: boolean;
};

export function WorkoutTraining({ trainingActive }: WorkoutTrainingProps) {
  const exercises = [
    { series: 1, kg: 35, reps: 15 },
    { series: 2, kg: 35, reps: 15 },
  ];

  const [checkedRows, setCheckedRows] = useState<number[]>([]);

  const toggleRow = (index: number) => {
    if (!trainingActive) return;
    setCheckedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
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
                <InputCheckbox
                  checked={checkedRows.includes(i)}
                  onChange={() => toggleRow(i)}
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
