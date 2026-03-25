import styles from "./styles.module.css";

type InputProps = { labelText: string } & React.ComponentProps<"input">;

export function Input({
  labelText,
  type,
  id,
  placeholder,
  ...props
}: InputProps) {
  return (
    <>
      <div className={styles.container}>
        {labelText && (
          <label htmlFor={id} className={styles.label}>
            {labelText}
          </label>
        )}
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          {...props}
          className={styles.input}
        />
      </div>
    </>
  );
}
