import styles from "./styles.module.css";

type ContainerProps = {
  children: React.ReactNode;
};

export function Container({ children, ...rest }: ContainerProps) {
  return (
    <div {...rest} className={styles.container}>
      {children}
    </div>
  );
}
