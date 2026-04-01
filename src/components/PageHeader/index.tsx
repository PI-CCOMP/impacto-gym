import styles from "./styles.module.css";

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type PageHeaderProps = {
  children: React.ReactNode;
};

export function PageHeader({ children }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)} className={styles.previousPage}>
      <ArrowLeft className={styles.icon} />
      <h1 className={styles.title}>{children}</h1>
    </button>
  );
}
