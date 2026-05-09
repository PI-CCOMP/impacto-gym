import styles from "./styles.module.css";

type DashboardRowProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  variant?: "responsive" | "sideBySide";
};

export function DashboardRow({
  children,
  variant = "responsive",
  style,
  ...props
}: DashboardRowProps) {
  const rowClass = `${styles.container} ${variant === "sideBySide" ? styles.sideBySide : styles.responsive}`;

  return (
    <div className={rowClass} style={style} {...props}>
      {children}
    </div>
  );
}
