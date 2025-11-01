import styles from "./styles.module.css";

type InputCheckboxProps = {
  labelText?: string;
} & React.ComponentProps<"input">;

export function InputCheckbox({ labelText, id, ...props }: InputCheckboxProps) {
  if (labelText) {
    return (
      <div className={styles.container}>
        <input type="checkbox" id={id} className={styles.input} {...props} />
        <label htmlFor={id} className={styles.label}>
          {labelText}
        </label>
      </div>
    );
  }

  return <input type="checkbox" id={id} className={styles.input} {...props} />;
}
