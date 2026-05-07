import { Link } from "react-router-dom";

import styles from "./styles.module.css";
import { CircleHelp } from "lucide-react";

type TrainingHeaderProps = {
  muscleGroups: string[];
  author: string;
  duration: number;
  totalVolume: number;
  trainingActive: boolean;
  showStats?: boolean;
  finishedAt?: string;
};

function formatDuration(seconds: number) {
  if (seconds < 3600) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}min ${sec < 10 ? "0" : ""}${sec}s`;
  }

  if (seconds < 86400) {
    const h = Math.floor(seconds / 3600);
    const min = Math.floor((seconds % 3600) / 60);
    return min > 0 ? `${h}h ${min}min` : `${h}h`;
  }

  if (seconds < 2592000) {
    const days = Math.floor(seconds / 86400);
    return `${days}d`;
  }

  if (seconds < 31536000) {
    const months = Math.floor(seconds / 2592000);
    return `${months}m`;
  }

  const years = Math.floor(seconds / 31536000);
  return `${years}a`;
}

export function TrainingHeader({
  muscleGroups,
  author,
  duration,
  totalVolume,
  trainingActive,
  showStats,
  finishedAt,
}: TrainingHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titleRow}>
        <h1>
          {finishedAt ? finishedAt : "Hoje"} foi dia de
          {muscleGroups.map((muscle, index) => {
            const isLast = index === muscleGroups.length - 1;
            const isSecondLast = index === muscleGroups.length - 2;
            return (
              <span key={index}>
                <span className={styles.muscleGroup}> {muscle}</span>
                {!isLast && (isSecondLast ? " e " : ",")}
              </span>
            );
          })}
          !
        </h1>
        {trainingActive && (
          <Link to={"/solicitacao-auxilio"}>
            <CircleHelp className={styles.helpIcon} />
          </Link>
        )}
      </div>

      <p className={styles.author}>Criado por {author}</p>

      {(trainingActive || showStats) && (
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Duração</span>
            <span className={styles.statValue}>{formatDuration(duration)}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Volume</span>
            <span className={styles.statValue}>{totalVolume} kg</span>
          </div>
        </div>
      )}
    </header>
  );
}
