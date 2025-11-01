import styles from "./styles.module.css";

type ButtonStrokeProps = {
  children: React.ReactNode;
};

export function ButtonStroke({ children }: ButtonStrokeProps) {
  return <button className={styles.button}>{children}</button>;
}
