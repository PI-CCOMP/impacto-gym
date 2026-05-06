import { X } from "lucide-react";
import styles from "./styles.module.css";

type HelpRequestCardProps = {
  trainingName: string;
  exerciseName: string;
  image: string;
  alt: string;
  requestedAt: number; // timestamp
  onRemove: () => void;
};

function formatRequestDate(timestamp: number): string {
  const date = new Date(timestamp);
  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const months = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];

  const weekday = weekdays[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${weekday} - ${day} de ${month} ${year} - ${hours}:${minutes}h`;
}

export function HelpRequestCard({
  trainingName,
  exerciseName,
  image,
  alt,
  requestedAt,
  onRemove,
}: HelpRequestCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img src={image} alt={alt} className={styles.img} />
        <div className={styles.info}>
          <p className={styles.trainingName}>{trainingName}</p>
          <p className={styles.exerciseName}>{exerciseName}</p>
          <p className={styles.date}>{formatRequestDate(requestedAt)}</p>
        </div>
      </div>
      <button
        className={styles.removeBtn}
        onClick={onRemove}
        aria-label="Remover pedido"
      >
        <X />
      </button>
    </div>
  );
}
