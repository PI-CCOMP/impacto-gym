import styles from "./styles.module.css";

type ButtonProps = {
  children: React.ReactNode;
};

export function Button({ children }: ButtonProps) {
  return <button className={styles.button}>{children}</button>;
}
