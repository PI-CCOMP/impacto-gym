import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { midiaExercicioPrivadaPorUrl } from "../../services/api";
import { ActionButton } from "../ActionButton";
import styles from "./styles.module.css";

type ExerciseCardProps = {
  id: string;
  image: string | null;
  alt: string;
  exerciseName: string;
  selected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onRemove?: () => void;
};

export function ExerciseCard({
  id,
  image,
  alt,
  exerciseName,
  selected,
  onClick,
  onDoubleClick,
  onRemove,
}: ExerciseCardProps) {
  const [displayImage, setDisplayImage] = useState(image ?? "");
  const [mediaError, setMediaError] = useState("");

  useEffect(() => {
    let active = true;
    setDisplayImage(image ?? "");
    setMediaError("");
    midiaExercicioPrivadaPorUrl(image)
      .then((resolvedImage) => {
        if (active && resolvedImage) setDisplayImage(resolvedImage);
      })
      .catch(() => {
        if (active) {
          setDisplayImage("");
          setMediaError("Não foi possível carregar a foto do exercício.");
        }
      });
    return () => {
      active = false;
    };
  }, [image]);

  return (
    <article
      className={`${styles.container} ${selected ? styles.selected : ""}`}
      data-exercise-id={id}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      style={{
        cursor: onClick || onDoubleClick ? "pointer" : "default",
      }}
    >
      {displayImage && (
        <img
          src={displayImage}
          alt={alt}
          className={styles.img}
          style={{ objectFit: "cover" }}
        />
      )}
      <p>{exerciseName}</p>
      {onRemove && (
        <ActionButton
          type="button"
          variant="close"
          icon={<X size={18} />}
          title={`Remover ${exerciseName} do treino`}
          aria-label={`Remover ${exerciseName} do treino`}
          style={{
            position: "absolute",
            right: "var(--size-sm)",
            top: "50%",
            transform: "translateY(-50%)",
          }}
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
        />
      )}
      {mediaError && <p role="alert">{mediaError}</p>}
    </article>
  );
}
