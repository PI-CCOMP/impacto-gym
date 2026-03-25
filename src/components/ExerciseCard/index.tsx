import styles from "./styles.module.css";

type ExerciseCardProps = {
  image: string;
  alt: string;
  exerciseName: string;
};

export function ExerciseCard({ image, alt, exerciseName }: ExerciseCardProps) {
  return (
    <div className={styles.container}>
      <img src={image} alt={alt} className={styles.img} />
      <p>{exerciseName}</p>
    </div>
  );
}
