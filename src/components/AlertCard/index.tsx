import { Edit2, Trash2 } from "lucide-react";
import { ActionButton } from "../ActionButton";
import styles from "./styles.module.css";

type AlertCardProps = {
  id: string;
  image: string;
  author: string;
  date: string;
  description: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function AlertCard({
  id,
  image,
  author,
  date,
  description,
  onEdit,
  onDelete,
}: AlertCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img src={image} className={styles.img} alt={author} />
        <div style={{ flex: 1 }}>
          <b>{author}</b>
          <p className={styles.date}>{date}</p>
        </div>
        <div style={{ display: "flex", gap: "var(--size-sm)" }}>
          {onEdit && (
            <ActionButton
              variant="edit"
              icon={<Edit2 size={16} />}
              title="Editar aviso"
              onClick={onEdit}
            />
          )}
          {onDelete && (
            <ActionButton
              variant="delete"
              icon={<Trash2 size={16} />}
              title="Deletar aviso"
              onClick={onDelete}
            />
          )}
        </div>
      </div>
      <p>{description}</p>
    </div>
  );
}
