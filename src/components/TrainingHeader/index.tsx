import { Link } from "react-router-dom";

import styles from "./styles.module.css";
import { CircleHelp } from "lucide-react";

type TrainingHeaderProps = {
  muscleGroups: string[];
  author: string;
  duration: number;
  totalVolume: number;
  trainingActive: boolean;
};

function formatDuration(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}min ${sec < 10 ? "0" : ""}${sec}s`;
}

export function TrainingHeader({
  muscleGroups,
  author,
  duration,
  totalVolume,
  trainingActive,
}: TrainingHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titleRow}>
        <h1>
          Hoje é dia de
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

      {trainingActive && (
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
