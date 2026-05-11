import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import styles from "./styles.module.css";

type TrainingHistoryCardProps = {
  id: string;
  trainingName: string;
  image: string;
  alt: string;
  finishedAt: string;
  muscleGroups: string[];
};

export function TrainingHistoryCard({
  id,
  trainingName,
  image,
  alt,
  finishedAt,
  muscleGroups,
}: TrainingHistoryCardProps) {
  return (
    <Link to={`/historico/${id}`} className={styles.container}>
      <article className={styles.content}>
        <img src={image} alt={alt} className={styles.img} />
        <div className={styles.info}>
          <p className={styles.trainingName}>{trainingName}</p>
          <p className={styles.exerciseName}>{muscleGroups.join(" · ")}</p>
          <time className={styles.date}>{finishedAt}</time>
        </div>
      </article>
      <ChevronRight className={styles.showIcon} aria-hidden="true" />
    </Link>
  );
}
