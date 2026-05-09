import styles from "./styles.module.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "blue" | "red";
};

export function Button({
  children,
  variant = "blue",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`${styles.button} ${styles[variant]} ${className || ""}`}
    >
      {children}
    </button>
  );
}
