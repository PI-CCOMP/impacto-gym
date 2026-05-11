import { X } from "lucide-react";
import styles from "./styles.module.css";
import { formatDateFull } from "../../utils/formatDate";

type HelpRequestCardProps = {
  trainingName: string;
  exerciseName: string;
  image: string;
  alt: string;
  requestedAt: number;
  onRemove: () => void;
};

export function HelpRequestCard({
  trainingName,
  exerciseName,
  image,
  alt,
  requestedAt,
  onRemove,
}: HelpRequestCardProps) {
  return (
    <article className={styles.container}>
      <div className={styles.content}>
        <img src={image} alt={alt} className={styles.img} />
        <div className={styles.info}>
          <p className={styles.trainingName}>{trainingName}</p>
          <p className={styles.exerciseName}>{exerciseName}</p>
          <time className={styles.date}>{formatDateFull(requestedAt)}</time>
        </div>
      </div>
      <button
        className={styles.removeBtn}
        onClick={onRemove}
        aria-label="Remover pedido"
      >
        <X />
      </button>
    </article>
  );
}
