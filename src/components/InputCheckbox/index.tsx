import styles from "./styles.module.css";

type InputCheckboxProps = { labelText: string } & React.ComponentProps<"input">;

export function InputCheckbox({ labelText, id }: InputCheckboxProps) {
  return (
    <div className={styles.container}>
      <input type="checkbox" id={id} className={styles.input} />
      <label htmlFor={id} className={styles.label}>
        {labelText}
      </label>
    </div>
  );
}
