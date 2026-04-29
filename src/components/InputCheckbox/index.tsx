import styles from "./styles.module.css";

type InputCheckboxProps = {
  labelText: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (id: string, checked: boolean) => void;
} & Omit<React.ComponentProps<"input">, "onChange">;

export function InputCheckbox({
  labelText,
  id,
  checked,
  disabled,
  onChange,
}: InputCheckboxProps) {
  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(id as string, e.target.checked)}
        className={styles.input}
      />
      <label
        htmlFor={id}
        className={`${styles.label} ${disabled ? styles.disabled : ""}`}
      >
        <span>{labelText}</span>
      </label>
    </div>
  );
}
