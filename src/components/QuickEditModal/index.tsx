import { X } from "lucide-react";
import { useState } from "react";
import styles from "./styles.module.css";

type QuickEditModalProps = {
  name: string;
  title?: string;
  onSave: (newName: string) => void;
  onClose: () => void;
};

export function QuickEditModal({
  name,
  title = "Edição rápida!",
  onSave,
  onClose,
}: QuickEditModalProps) {
  const [value, setValue] = useState(name);

  function handleSave() {
    if (value.trim()) {
      onSave(value.trim());
      onClose();
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <dialog
        open
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        aria-labelledby="quick-edit-title"
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fechar"
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

        <button className={styles.saveButton} onClick={handleSave}>
          Salvar
        </button>
      </dialog>
    </div>
  );
}
