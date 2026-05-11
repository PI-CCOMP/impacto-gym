import { useEffect } from "react";
import { X } from "lucide-react";
import styles from "./styles.module.css";

type ToastProps = {
  message: string;
  highlight?: string;
  icon?: React.ReactNode;
  duration?: number;
  highlightPosition?: "before" | "after";
  onClose: () => void;
  children?: React.ReactNode;
};

export function Toast({
  message,
  highlight,
  icon,
  duration = 3000,
  onClose,
  highlightPosition,
  children,
}: ToastProps) {
  useEffect(() => {
    if (children) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose, children]);

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-live="polite"
    >
      <div className={styles.toast}>
        <button className={styles.close} onClick={onClose} aria-label="Fechar">
          <X />
        </button>
        {icon && (
          <div className={styles.icon} aria-hidden="true">
            {icon}
          </div>
        )}
        <p className={styles.message}>
          {highlight && highlightPosition !== "after" && (
            <strong className={styles.highlight}>{highlight} </strong>
          )}
          {message}
          {highlight && highlightPosition === "after" && (
            <strong className={styles.highlight}> {highlight}</strong>
          )}
        </p>
        {children && <div className={styles.actions}>{children}</div>}
      </div>
    </div>
  );
}
