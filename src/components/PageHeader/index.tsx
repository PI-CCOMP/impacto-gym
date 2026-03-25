import styles from "./styles.module.css";
import { ArrowLeft } from "lucide-react";

type PageHeaderProps = {
  children: React.ReactNode;
};

export function PageHeader({ children }: PageHeaderProps) {
  return (
    <a href="#" className={styles.container}>
      <ArrowLeft className={styles.icon} />
      <h1 className={styles.title}>{children}</h1>
    </a>
  );
}
