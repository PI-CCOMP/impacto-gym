import styles from "./styles.module.css";

type AuthFormHeaderProps = {
  children: React.ReactNode;
};

export function AuthFormHeader({ children }: AuthFormHeaderProps) {
  return (
    <header className={styles.header}>
      <h1>{children}</h1>
      <p className={styles.subtitle}>Preencha os campos abaixo</p>
    </header>
  );
}
