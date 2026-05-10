import { useState } from "react";
import { validateEmailRequired, validatePassword } from "../validators";

export function useLoginForm() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  function validate(name: string, value: string): string {
    if (name === "email") return validateEmailRequired(value);
    if (name === "password") return validatePassword(value);
    return "";
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  }

  function handleSubmitValidate(): boolean {
    setSubmitAttempted(true);
    const newErrors = {
      email: validate("email", values.email),
      password: validate("password", values.password),
    };
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  }

  function getError(name: "email" | "password") {
    return touched[name] || submitAttempted ? errors[name] : "";
  }

  return { values, handleChange, handleSubmitValidate, getError };
}
