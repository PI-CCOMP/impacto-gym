import styles from "./styles.module.css";

type ContainerProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  isDashboard?: boolean;
};

export function Container({
  children,
  className,
  isDashboard,
  ...rest
}: ContainerProps) {
  return (
    <main
      {...rest}
      className={`${styles.container} ${isDashboard ? styles.dashboard : ""} ${className ?? ""}`}
    >
      {children}
    </main>
  );
}
