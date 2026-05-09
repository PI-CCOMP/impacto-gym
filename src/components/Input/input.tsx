import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./styles.module.css";

type InputProps = {
  labelText?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
} & React.ComponentProps<"input">;

export function Input({
  labelText,
  id,
  errorMessage,
  type,
  leftIcon,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={styles.container}>
      {labelText?.trim() && (
        <label htmlFor={id} className={styles.label}>
          {labelText}
        </label>
      )}

      <div className={styles.inputWrapper}>
        {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}

        <input
          id={id}
          type={inputType}
          className={`${styles.input} ${
            errorMessage ? styles.inputError : ""
          } ${leftIcon ? styles.inputWithIcon : ""}`}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {errorMessage && (
        <span className={styles.errorMessage}>{errorMessage}</span>
      )}
    </div>
  );
}
