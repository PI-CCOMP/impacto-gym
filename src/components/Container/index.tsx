import styles from "./styles.module.css";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
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
    <div
      {...rest}
      className={`${styles.container} ${isDashboard ? styles.dashboard : ""} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
