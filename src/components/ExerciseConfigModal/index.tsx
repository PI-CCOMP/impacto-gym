import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input/input";

import styles from "./styles.module.css";

export type ExerciseConfiguration = {
  series: number;
  kg: number;
  reps: number;
  restSeconds: number;
};

type ExerciseConfigModalProps = {
  exerciseName: string;
  initialValue?: ExerciseConfiguration;
  onSave: (configuration: ExerciseConfiguration) => void;
  onClose: () => void;
  onError: (message: string) => void;
};

export function ExerciseConfigModal({
  exerciseName,
  initialValue,
  onSave,
  onClose,
  onError,
}: ExerciseConfigModalProps) {
  const [configuration, setConfiguration] = useState<ExerciseConfiguration>(
    initialValue ?? { series: 3, kg: 0, reps: 12, restSeconds: 60 },
  );

  function handleChange(field: keyof ExerciseConfiguration, value: string) {
    setConfiguration((current) => ({ ...current, [field]: Number(value) }));
  }

  function handleSave() {
    if (
      !Number.isInteger(configuration.series) ||
      configuration.series < 1 ||
      !Number.isInteger(configuration.reps) ||
      configuration.reps < 1 ||
      configuration.kg < 0 ||
      configuration.restSeconds < 0
    ) {
      onError("Informe séries, repetições, carga e descanso válidos.");
      return;
    }
    onSave(configuration);
    onClose();
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} type="button">
          <X size={18} />
        </button>
        <h2 className={styles.title}>{exerciseName}</h2>
        <p className={styles.subtitle}>Configure as séries do exercício</p>
        <div className={styles.fields}>
          <Input
            labelText="Séries"
            type="number"
            id="series-count"
            name="series-count"
            min={1}
            value={configuration.series}
            onChange={(event) => handleChange("series", event.target.value)}
          />
          <Input
            labelText="Repetições por série"
            type="number"
            id="series-reps"
            name="series-reps"
            min={1}
            value={configuration.reps}
            onChange={(event) => handleChange("reps", event.target.value)}
          />
          <Input
            labelText="Carga sugerida (kg)"
            type="number"
            id="series-kg"
            name="series-kg"
            min={0}
            step="0.01"
            value={configuration.kg}
            onChange={(event) => handleChange("kg", event.target.value)}
          />
          <Input
            labelText="Descanso (s)"
            type="number"
            id="series-rest"
            name="series-rest"
            min={0}
            value={configuration.restSeconds}
            onChange={(event) =>
              handleChange("restSeconds", event.target.value)
            }
          />
        </div>
        <Button type="button" onClick={handleSave}>
          Salvar
        </Button>
      </div>
    </div>
  );
}
