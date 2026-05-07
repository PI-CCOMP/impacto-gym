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
    <div className={styles.overlay}>
      <div className={styles.toast}>
        <button className={styles.close} onClick={onClose}>
          <X />
        </button>
        {icon && <div className={styles.icon}>{icon}</div>}
        <p className={styles.message}>
          {highlight && highlightPosition !== "after" && (
            <span className={styles.highlight}>{highlight} </span>
          )}
          {message}
          {highlight && highlightPosition === "after" && (
            <span className={styles.highlight}> {highlight}</span>
          )}
        </p>
        {children && <div className={styles.actions}>{children}</div>}
      </div>
    </div>
  );
}
