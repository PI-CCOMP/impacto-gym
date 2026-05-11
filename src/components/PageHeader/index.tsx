import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { ArrowLeft } from "lucide-react";

type PageHeaderProps = {
  onBack?: () => void;
  children: string;
};

export function PageHeader({ onBack, children }: PageHeaderProps) {
  const navigate = useNavigate();

  function handleBack() {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  }

  return (
    <header className={styles.previousPage}>
      <button
        onClick={handleBack}
        className={styles.backButton}
        aria-label="Voltar"
      >
        <ArrowLeft className={styles.icon} />
      </button>
      <h1 className={styles.title}>{children}</h1>
    </header>
  );
}
