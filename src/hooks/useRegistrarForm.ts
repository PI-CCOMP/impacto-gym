import { useState } from "react";
import {
  validateName,
  validateCPF,
  validateEmail,
  validateConfirmEmail,
  validatePassword,
  validateConfirmPassword,
  formatCPF,
} from "../validators";

type FormValues = {
  name: string;
  cpf: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  gender: string;
  deficiency: string[];
  medicalRestriction: string[];
  objective: string;
  experience: string;
};

export function useRegistrarForm() {
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    cpf: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    gender: "",
    deficiency: [],
    medicalRestriction: [],
    objective: "",
    experience: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  function validate(name: string, value: string): string {
    switch (name) {
      case "name":
        return validateName(value);
      case "cpf":
        return validateCPF(value);
      case "email":
        return validateEmail(value);
      case "confirmEmail":
        return validateConfirmEmail(value, formValues.email);
      case "password":
        return validatePassword(value);
      case "confirmPassword":
        return validateConfirmPassword(value, formValues.password);
      default:
        return "";
    }
  }

  function validateStep(
    stepId: number,
    medicalReportFile: File | null,
  ): Record<string, string> {
    const e: Record<string, string> = {};
    if (stepId === 1) {
      e.name = validateName(formValues.name);
      e.cpf = validateCPF(formValues.cpf);
      e.email = validateEmail(formValues.email);
      e.confirmEmail = validateConfirmEmail(
        formValues.confirmEmail,
        formValues.email,
      );
    }
    if (stepId === 2) {
      e.password = validatePassword(formValues.password);
      e.confirmPassword = validateConfirmPassword(
        formValues.confirmPassword,
        formValues.password,
      );
    }
    if (stepId === 3 && !formValues.gender) e.gender = "Selecione uma opção.";
    if (stepId === 4 && formValues.deficiency.length === 0)
      e.deficiency = "Selecione ao menos uma opção.";
    if (stepId === 5 && formValues.medicalRestriction.length === 0)
      e.medicalRestriction = "Selecione ao menos uma opção.";
    if (stepId === 6 && !medicalReportFile)
      e.medicalReport = "Anexe o laudo médico.";
    if (stepId === 7 && !formValues.objective)
      e.objective = "Selecione uma opção.";
    if (stepId === 8 && !formValues.experience)
      e.experience = "Selecione uma opção.";
    return Object.fromEntries(Object.entries(e).filter(([, v]) => v !== ""));
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const formatted = name === "cpf" ? formatCPF(value) : value;
    setFormValues((prev) => ({ ...prev, [name]: formatted }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, formatted) }));
  }

  function handleCheckboxChange(
    field: "deficiency" | "medicalRestriction",
    noneId: string,
    id: string,
    checked: boolean,
  ) {
    setFormValues((prev) => {
      const current = prev[field];
      if (id === noneId) return { ...prev, [field]: checked ? [noneId] : [] };
      const withoutNone = current.filter((v) => v !== noneId);
      const updated = checked
        ? [...withoutNone, id]
        : withoutNone.filter((v) => v !== id);
      return { ...prev, [field]: updated };
    });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function handleRadioChange(
    field: "gender" | "objective" | "experience",
    value: string,
  ) {
    setFormValues((prev) => ({
      ...prev,
      [field]: prev[field] === value ? "" : value,
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function getFieldError(name: string): string {
    return touched[name] || submitAttempted ? (errors[name] ?? "") : "";
  }

  return {
    formValues,
    errors,
    touched,
    submitAttempted,
    setSubmitAttempted,
    setErrors,
    setTouched,
    handleInputChange,
    handleCheckboxChange,
    handleRadioChange,
    validateStep,
    getFieldError,
  };
}
