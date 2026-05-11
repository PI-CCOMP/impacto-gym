import styles from "./styles.module.css";

type FormHeaderProps = {
  children: React.ReactNode;
  subtitle?: string;
};

export function FormHeader({ children, subtitle }: FormHeaderProps) {
  return (
    <hgroup className={styles.header}>
      <h2 className={styles.title}>{children}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </hgroup>
  );
}
