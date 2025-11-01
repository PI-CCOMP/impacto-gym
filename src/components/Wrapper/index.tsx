import styles from "./styles.module.css";

type WrapperProps = {
  children: React.ReactNode;
};

export function Wrapper({ children }: WrapperProps) {
  return <div className={styles.wrapper}>{children}</div>;
}
