import { useState } from "react";
import {
  validateName,
  validateEmail,
  validateCPF,
  formatCPF,
} from "../validators";

export type UserFormValues = {
  name: string;
  cpf: string;
  email: string;
  gender: string;
  profile: string;
  goal: string;
  experience: string;
  disability: string;
  medicalRestriction: string;
};

type UseUserFormOptions = {
  initial?: Partial<UserFormValues>;
  mode: "create" | "edit";
};

const defaults: UserFormValues = {
  name: "",
  cpf: "",
  email: "",
  gender: "Masculino",
  profile: "Aluno",
  goal: "Hipertrofia",
  experience: "Iniciante",
  disability: "Nenhuma",
  medicalRestriction: "Nenhuma",
};

export function useUserForm({ initial = {}, mode }: UseUserFormOptions) {
  const [values, setValues] = useState<UserFormValues>({
    ...defaults,
    ...initial,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const requiresMedicalReport =
    values.disability !== "Nenhuma" || values.medicalRestriction !== "Nenhuma";

  function validateAll(medicalReportFile: File | null): Record<string, string> {
    const e: Record<string, string> = {};

    const nameError = validateName(values.name);
    const emailError = validateEmail(values.email);
    if (nameError) e.name = nameError;
    if (emailError) e.email = emailError;

    if (mode === "create") {
      const cpfError = validateCPF(values.cpf);
      if (cpfError) e.cpf = cpfError;
    }

    if (requiresMedicalReport && !medicalReportFile) {
      e.medicalReport =
        "Anexe o laudo médico para deficiência ou restrição informada.";
    }

    return e;
  }

  function handleChange(field: keyof UserFormValues, value: string) {
    const formatted = field === "cpf" ? formatCPF(value) : value;
    setValues((prev) => ({ ...prev, [field]: formatted }));
    if (submitAttempted) {
      setErrors((prev) => {
        const updated = { ...prev };
        if (field === "name") updated.name = validateName(formatted);
        if (field === "email") updated.email = validateEmail(formatted);
        if (field === "cpf") updated.cpf = validateCPF(formatted);
        // limpa erro do laudo se voltou para Nenhuma nos dois campos
        if (field === "disability" || field === "medicalRestriction") {
          const newDisability =
            field === "disability" ? formatted : values.disability;
          const newRestriction =
            field === "medicalRestriction"
              ? formatted
              : values.medicalRestriction;
          if (newDisability === "Nenhuma" && newRestriction === "Nenhuma") {
            delete updated.medicalReport;
          }
        }
        return updated;
      });
    }
  }

  function handleSubmitValidate(medicalReportFile: File | null): boolean {
    setSubmitAttempted(true);
    const newErrors = validateAll(medicalReportFile);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function getError(field: string): string | undefined {
    return submitAttempted ? errors[field] : undefined;
  }

  return {
    values,
    errors,
    submitAttempted,
    requiresMedicalReport,
    handleChange,
    handleSubmitValidate,
    getError,
  };
}
