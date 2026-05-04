import styles from "./styles.module.css";

type RowProps = {
  typeRow: "row" | "row-space";
  children: React.ReactNode;
};

export function Row({ children, typeRow = "row" }: RowProps) {
  return <div className={styles[typeRow]}>{children}</div>;
}
