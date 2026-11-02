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
  disability: string[];
  medicalRestriction: string[];
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
  disability: ["nenhuma"],
  medicalRestriction: ["nenhuma"],
};

export function useUserForm({ initial = {}, mode }: UseUserFormOptions) {
  const [values, setValues] = useState<UserFormValues>({
    ...defaults,
    ...initial,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const requiresMedicalReport =
    values.disability.some((value) => value !== "nenhuma") ||
    values.medicalRestriction.some((value) => value !== "nenhuma");

  function validateAll(): Record<string, string> {
    const e: Record<string, string> = {};

    const nameError = validateName(values.name);
    const emailError = validateEmail(values.email);
    if (nameError) e.name = nameError;
    if (emailError) e.email = emailError;

    if (mode === "create") {
      const cpfError = validateCPF(values.cpf);
      if (cpfError) e.cpf = cpfError;
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
        return updated;
      });
    }
  }

  function handleMedicalToggle(
    field: "disability" | "medicalRestriction",
    option: string,
    checked: boolean,
  ) {
    setValues((prev) => {
      const current = prev[field];
      const updated =
        option === "nenhuma"
          ? checked
            ? ["nenhuma"]
            : []
          : checked
            ? [...current.filter((value) => value !== "nenhuma"), option]
            : current.filter((value) => value !== option);
      return { ...prev, [field]: [...new Set(updated)] };
    });
  }

  function handleSubmitValidate(): boolean {
    setSubmitAttempted(true);
    const newErrors = validateAll();
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
    handleMedicalToggle,
    handleSubmitValidate,
    getError,
  };
}
