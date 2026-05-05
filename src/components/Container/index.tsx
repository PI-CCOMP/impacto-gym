import styles from "./styles.module.css";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function Container({ children, className, ...rest }: ContainerProps) {
  return (
    <div {...rest} className={`${styles.container} ${className ?? ""}`}>
      {children}
    </div>
  );
}
