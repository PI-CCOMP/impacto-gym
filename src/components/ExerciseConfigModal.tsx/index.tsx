import { X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input/input";
import styles from "./styles.module.css";

type Series = {
  kg: number;
  reps: number;
  restSeconds: number;
};

type ExerciseConfigModalProps = {
  exerciseName: string;
  onSave: (series: Series[]) => void;
  onClose: () => void;
  onError: (message: string) => void;
};

export function ExerciseConfigModal({
  exerciseName,
  onSave,
  onClose,
  onError,
}: ExerciseConfigModalProps) {
  const [series, setSeries] = useState<Series[]>([
    { kg: 0, reps: 0, restSeconds: 60 },
  ]);

  function handleChange(index: number, field: keyof Series, value: string) {
    setSeries((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: Number(value) } : s)),
    );
  }

  function handleAddSeries() {
    setSeries((prev) => [...prev, { kg: 0, reps: 0, restSeconds: 60 }]);
  }

  function handleRemoveSeries(index: number) {
    if (series.length === 1) return;
    setSeries((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSave() {
    const hasEmpty = series.some((s) => s.reps === 0);
    if (hasEmpty) {
      onError("Preencha as repetições de todas as séries.");
      return;
    }
    onSave(series);
    onClose();
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} type="button">
          <X size={18} />
        </button>

        <h2 className={styles.title}>{exerciseName}</h2>
        <p className={styles.subtitle}>Configure as séries</p>

        <div className={styles.seriesList}>
          {series.map((s, index) => (
            <div key={index} className={styles.seriesRow}>
              <div className={styles.seriesHeader}>
                <span className={styles.seriesLabel}>Série {index + 1}</span>
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveSeries(index)}
                  disabled={series.length === 1}
                  type="button"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className={styles.fields}>
                <Input
                  labelText="Kg"
                  type="number"
                  id={`kg-${index}`}
                  name={`kg-${index}`}
                  min={0}
                  value={s.kg}
                  onChange={(e) => handleChange(index, "kg", e.target.value)}
                />
                <Input
                  labelText="Reps"
                  type="number"
                  id={`reps-${index}`}
                  name={`reps-${index}`}
                  min={0}
                  value={s.reps}
                  onChange={(e) => handleChange(index, "reps", e.target.value)}
                />
                <Input
                  labelText="Descanso (s)"
                  type="number"
                  id={`rest-${index}`}
                  name={`rest-${index}`}
                  min={0}
                  value={s.restSeconds}
                  onChange={(e) =>
                    handleChange(index, "restSeconds", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <button
          className={styles.addButton}
          onClick={handleAddSeries}
          type="button"
        >
          <Plus size={16} />
          Adicionar Série
        </button>

        <Button type="button" onClick={handleSave}>
          Salvar
        </Button>
      </div>
    </div>
  );
}
