import { useEffect, useRef } from "react";
import styles from "./styles.module.css";

type ExerciseCardProps = {
  id: string;
  image: string;
  alt: string;
  exerciseName: string;
  selected?: boolean;
  /** Quando true exibe o GIF animado (página de detalhe). Padrão: false (card pequeno — imagem estática). */
  animated?: boolean;
  onClick?: () => void;
};

/**
 * Quando `animated` é false (padrão), renderiza o GIF pausado no primeiro frame
 * desenhando-o em um <canvas>. Isso evita a animação nos cards da lista.
 * Quando `animated` é true (página de detalhe do exercício), usa <img> normal.
 */
function StaticGif({ src, alt, className }: { src: string; alt: string; className: string }) {
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

export function ExerciseCard({
  id,
  image,
  alt,
  exerciseName,
  selected,
  animated = false,
  onClick,
}: ExerciseCardProps) {
  return (
    <article
      className={`${styles.container} ${selected ? styles.selected : ""}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {animated ? (
        <img src={image} alt={alt} className={styles.img} />
      ) : (
        <StaticGif src={image} alt={alt} className={styles.img} />
      )}
      <p>{exerciseName}</p>
    </article>
  );
}
