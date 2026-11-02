import { X } from "lucide-react";
import { useState } from "react";
import styles from "./styles.module.css";

type QuickEditModalProps = {
  name: string;
  description?: string;
  descriptionLabel?: string;
  title?: string;
  onSave: (newName: string, description?: string) => void;
  onClose: () => void;
};

export function QuickEditModal({
  name,
  description,
  descriptionLabel = "Descrição",
  title = "Edição rápida!",
  onSave,
  onClose,
}: QuickEditModalProps) {
  const [value, setValue] = useState(name);
  const [detail, setDetail] = useState(description ?? "");

  function handleSave() {
    if (value.trim() && (description === undefined || detail.trim())) {
      onSave(value.trim(), description === undefined ? undefined : detail.trim());
      onClose();
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-edit-title"
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fechar"
          type="button"
        >
          <X size={18} />
        </button>

        <h2 id="quick-edit-title" className={styles.title}>
          {title}
        </h2>
        <p className={styles.subtitle}>Preencha o campo abaixo</p>

        <label className={styles.label} htmlFor="quick-edit-name">
          Nome
        </label>
        <input
          id="quick-edit-name"
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          autoFocus
        />
        {description !== undefined && (
          <>
            <label className={styles.label} htmlFor="quick-edit-description">
              {descriptionLabel}
            </label>
            <textarea
              id="quick-edit-description"
              className={styles.input}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              rows={4}
            />
          </>
        )}

        <button
          className={styles.saveButton}
          onClick={handleSave}
          type="button"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}
