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
    <div
      className={`${styles.container} ${
        variant === "dashboard" ? styles.dashboard : ""
      }`}
      data-state={dataState}
    >
      <img src={image} alt={alt} className={styles.img} />

      <div className={styles.content}>
        <h2>{trainingName}</h2>

        {muscleGroups && (
          <div className={styles.muscleGroups}>
            {muscleGroups.map((muscleGroup, index) => (
              <span key={index}>
                <Dumbbell className={styles.icon} />
                {muscleGroup}
              </span>
            ))}
          </div>
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
    </div>
  );
}
