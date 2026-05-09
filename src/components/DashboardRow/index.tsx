import styles from "./styles.module.css";

type DashboardRowProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function DashboardRow({ children }: DashboardRowProps) {
  return <div className={styles.container}>{children}</div>;
}
