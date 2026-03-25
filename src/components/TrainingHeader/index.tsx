import styles from "./styles.module.css";

type TrainingHeaderProps = {
  muscleGroups: string[];
  author: string;
};

export function TrainingHeader({ muscleGroups, author }: TrainingHeaderProps) {
  return (
    <header className={styles.header}>
      <h1>
        Hoje é dia de{" "}
        {muscleGroups.map((muscle, index) => {
          const isLast = index === muscleGroups.length - 1;
          const isSecondLast = index === muscleGroups.length - 2;

          return (
            <span key={index}>
              <span className={styles.muscleGroup}>{muscle}</span>
              {!isLast && (isSecondLast ? " e " : ", ")}
            </span>
          );
        })}
        !
      </h1>
      <p className={styles.author}>Criado por {author}</p>
    </header>
  );
}
