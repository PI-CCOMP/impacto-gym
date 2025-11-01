import styles from "./styles.module.css";

type ExerciseCardProps = {
  image: string;
  alt: string;
  ExerciseName: string;
};

export function ExerciseCard({ image, alt, ExerciseName }: ExerciseCardProps) {
  return (
    <div className={styles.container}>
      <img src={image} alt={alt} className={styles.img} />
      <p>{ExerciseName}</p>
    </div>
  );
}
