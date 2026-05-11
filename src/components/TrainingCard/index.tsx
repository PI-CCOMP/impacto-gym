import styles from "./styles.module.css";
import { Dumbbell, X } from "lucide-react";
import { ActionButton } from "../ActionButton";

type TrainingCardProps = {
  dataState: string;
  image: string;
  alt: string;
  trainingName: string;
  muscleGroups: string[];
  variant?: "default" | "dashboard";
  onUnlink?: () => void;
};

export function TrainingCard({
  dataState,
  image,
  alt,
  trainingName,
  muscleGroups,
  variant = "default",
  onUnlink,
}: TrainingCardProps) {
  return (
    <article
      className={`${styles.container} ${variant === "dashboard" ? styles.dashboard : ""}`}
      data-state={dataState}
    >
      <img src={image} alt={alt} className={styles.img} />

      <div className={styles.content}>
        <h3>{trainingName}</h3>

        {muscleGroups && (
          <ul className={styles.muscleGroups}>
            {muscleGroups.map((muscleGroup, index) => (
              <li key={index}>
                <Dumbbell className={styles.icon} aria-hidden="true" />
                {muscleGroup}
              </li>
            ))}
          </ul>
        )}
      </div>

      {onUnlink && (
        <ActionButton
          variant="close"
          icon={<X size={16} />}
          title="Desvincular treino"
          onClick={(e) => {
            e.stopPropagation();
            onUnlink();
          }}
        />
      )}
    </article>
  );
}
