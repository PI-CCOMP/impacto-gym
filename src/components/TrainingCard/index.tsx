import styles from "./styles.module.css";

import { Dumbbell } from "lucide-react";

type TrainingCardProps = {
  dataState: string;
  image: string;
  alt: string;
  trainingName: string;
  muscleGroups: string[];
};

export function TrainingCard({
  dataState,
  image,
  alt,
  trainingName,
  muscleGroups,
}: TrainingCardProps) {
  return (
    <div className={styles.container} data-state={dataState}>
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
    </div>
  );
}
