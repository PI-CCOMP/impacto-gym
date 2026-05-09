import styles from "./styles.module.css";

type ActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  variant?: "edit" | "delete" | "view" | "accept" | "close";
};

export function ActionButton({
  icon,
  variant = "view",
  ...rest
}: ActionButtonProps) {
  return (
    <button className={`${styles.button} ${styles[variant]}`} {...rest}>
      {icon}
    </button>
  );
}
