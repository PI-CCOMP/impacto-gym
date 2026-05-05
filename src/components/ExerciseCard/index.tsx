import styles from "./styles.module.css";

type ExerciseCardProps = {
  id: string;
  image: string;
  alt: string;
  exerciseName: string;
  onClick?: () => void;
};

export function ExerciseCard({
  id,
  image,
  alt,
  exerciseName,
  onClick,
}: ExerciseCardProps) {
  return (
    <div
      className={styles.container}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <img src={image} alt={alt} className={styles.img} />
      <p>{exerciseName}</p>
    </div>
  );
}
