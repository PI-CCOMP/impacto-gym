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
    <button onClick={handleBack} className={styles.previousPage}>
      <ArrowLeft className={styles.icon} />
      <h1 className={styles.title}>{children}</h1>
    </button>
  );
}
