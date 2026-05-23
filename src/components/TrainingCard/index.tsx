import { useEffect, useRef } from "react";
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
  /** Quando true exibe o GIF animado. Padrão: false (card — imagem estática). */
  animated?: boolean;
  onUnlink?: () => void;
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

export function TrainingCard({
  dataState,
  image,
  alt,
  trainingName,
  muscleGroups,
  variant = "default",
  animated = false,
  onUnlink,
}: TrainingCardProps) {
  return (
    <article
      className={`${styles.container} ${variant === "dashboard" ? styles.dashboard : ""}`}
      data-state={dataState}
    >
      {animated ? (
        <img src={image} alt={alt} className={styles.img} />
      ) : (
        <StaticGif src={image} alt={alt} className={styles.img} />
      )}

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
