import styles from "./styles.module.css";

type RowProps = {
  children: React.ReactNode;
};

export function Row({ children }: RowProps) {
  return <div className={styles.row}>{children}</div>;
}
