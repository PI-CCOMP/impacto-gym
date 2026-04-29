export function validateName(value: string): string {
  return value.trim().length < 3 ? "Nome deve ter ao menos 3 caracteres." : "";
}

export function validateEmail(value: string): string {
  return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ? "E-mail inválido."
    : "";
}

export function validateConfirmEmail(value: string, email: string): string {
  if (!value.trim()) return "Confirme seu e-mail.";
  return value.trim() !== email.trim() ? "Os e-mails não coincidem." : "";
}

export function validateCPF(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 11)
    return "CPF inválido. Use o formato 000.000.000-00.";
  if (/^(\d)\1+$/.test(digits)) return "CPF inválido.";
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[9])) return "CPF inválido.";
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[10])) return "CPF inválido.";
  return "";
}

export function validatePassword(value: string): string {
  if (value.length < 8) return "Senha deve ter ao menos 8 caracteres.";
  if (!/[a-zA-Z]/.test(value)) return "Senha deve conter ao menos uma letra.";
  if (!/[0-9]/.test(value)) return "Senha deve conter ao menos um número.";
  if (!/[^a-zA-Z0-9]/.test(value))
    return "Senha deve conter ao menos um caractere especial.";
  return "";
}

export function validatePasswordLogin(value: string): string {
  return value.trim().length === 0 ? "Informe a senha." : "";
}

export function validateConfirmPassword(
  value: string,
  password: string,
): string {
  return value !== password ? "As senhas não coincidem." : "";
}

export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

export function validateEmailRequired(value: string): string {
  return value.trim().length === 0 ? "Informe o e-mail." : validateEmail(value);
}
