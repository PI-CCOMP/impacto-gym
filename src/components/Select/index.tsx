import { ChevronDown } from "lucide-react";

import styles from "./styles.module.css";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  labelText?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
  disabled?: boolean;
};

export function Select({
  labelText,
  options,
  value,
  onChange,
  id,
  disabled,
}: SelectProps) {
  return (
    <div className={styles.container}>
      {labelText && (
        <label htmlFor={id} className={styles.label}>
          {labelText}
        </label>
      )}

      <div className={styles.selectWrapper}>
        <select
          id={id}
          value={value}
          disabled={disabled}
          className={styles.select}
          onChange={(e) => onChange?.(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown size={18} className={styles.icon} />
      </div>
    </div>
  );
}
