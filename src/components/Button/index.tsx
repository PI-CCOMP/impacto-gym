import styles from "./styles.module.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button {...props} className={styles.button}>
      {children}
    </button>
  );
}
