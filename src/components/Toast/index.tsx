import { useEffect } from "react";
import { X } from "lucide-react";
import styles from "./styles.module.css";

type ToastProps = {
  message: string;
  highlight?: string;
  icon?: React.ReactNode;
  duration?: number;
  onClose: () => void;
};

export function Toast({
  message,
  highlight,
  icon,
  duration = 3000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={styles.overlay}>
      <div className={styles.toast}>
        <button className={styles.close} onClick={onClose}>
          <X size={16} />
        </button>
        {icon && <div className={styles.icon}>{icon}</div>}
        <p className={styles.message}>
          {message}
          {highlight && <span className={styles.highlight}> {highlight}</span>}
        </p>
      </div>
    </div>
  );
}
