import styles from "./styles.module.css";

type ButtonStrokeProps = {
  onClick?: () => void;
  children: React.ReactNode;
};

export function ButtonStroke({ onClick, children }: ButtonStrokeProps) {
  return (
    <button onClick={onClick} className={styles.button}>
      {children}
    </button>
  );
}
