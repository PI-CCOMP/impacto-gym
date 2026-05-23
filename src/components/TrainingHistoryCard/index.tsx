import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import styles from "./styles.module.css";

type TrainingHistoryCardProps = {
  id: string;
  trainingName: string;
  image: string;
  alt: string;
  finishedAt: string;
  muscleGroups: string[];
};

function StaticGif({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth || 64;
      canvas.height = img.naturalHeight || 64;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
    };
    img.src = src;
  }, [src]);

  return <canvas ref={canvasRef} aria-label={alt} className={className} />;
}

export function TrainingHistoryCard({
  id,
  trainingName,
  image,
  alt,
  finishedAt,
  muscleGroups,
}: TrainingHistoryCardProps) {
  return (
    <Link to={`/historico/${id}`} className={styles.container}>
      <article className={styles.content}>
        <StaticGif src={image} alt={alt} className={styles.img} />
        <div className={styles.info}>
          <p className={styles.trainingName}>{trainingName}</p>
          <p className={styles.exerciseName}>{muscleGroups.join(" · ")}</p>
          <time className={styles.date}>{finishedAt}</time>
        </div>
      </article>
      <ChevronRight className={styles.showIcon} aria-hidden="true" />
    </Link>
  );
}
