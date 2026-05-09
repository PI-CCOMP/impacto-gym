import styles from "./styles.module.css";

type ExerciseCardProps = {
  id: string;
  image: string;
  alt: string;
  exerciseName: string;
  selected?: boolean;
  onClick?: () => void;
};

export function ExerciseCard({
  id,
  image,
  alt,
  exerciseName,
  selected,
  onClick,
}: ExerciseCardProps) {
  return (
    <div
      className={`${styles.container} ${selected ? styles.selected : ""}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <img src={image} alt={alt} className={styles.img} />
      <p>{exerciseName}</p>
    </div>
  );
}
