import styles from "./styles.module.css";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function DashboardGrid({ children }: ContainerProps) {
  return <div className={styles.container}>{children}</div>;
}
