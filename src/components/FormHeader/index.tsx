import styles from "./styles.module.css";

type FormHeaderProps = {
  children: React.ReactNode;
  subtitle?: string;
};

export function FormHeader({ children, subtitle }: FormHeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{children}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
