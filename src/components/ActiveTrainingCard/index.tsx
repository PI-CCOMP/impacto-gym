import { useNavigate } from "react-router-dom";
import { PlayCircle } from "lucide-react";

import { Button } from "../Button";
import { ButtonStroke } from "../ButtonStroke";
import { Line } from "../Line";

import styles from "./styles.module.css";

type ActiveTrainingCardProps = {
  trainingId: string;
  trainingName: string;
  checkedCount: number;
  totalSeries: number;
  onFinish: () => void;
};

export function ActiveTrainingCard({
  trainingId,
  trainingName,
  checkedCount,
  totalSeries,
  onFinish,
}: ActiveTrainingCardProps) {
  const navigate = useNavigate();
  const progress = totalSeries > 0 ? (checkedCount / totalSeries) * 100 : 0;

  return (
    <div className={styles.card}>
      <p className={styles.label}>Treino em andamento</p>
      <strong className={styles.name}>{trainingName}</strong>

      <div className={styles.progressWrapper}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>
      <span className={styles.progressText}>
        {checkedCount} / {totalSeries} séries
      </span>

      <div className={styles.actions}>
        <Button onClick={() => navigate(`/treino/${trainingId}`)}>
          Continuar
        </Button>
        <ButtonStroke onClick={onFinish}>Encerrar</ButtonStroke>
      </div>
    </div>
  );
}
