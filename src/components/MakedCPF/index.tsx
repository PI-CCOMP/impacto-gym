import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./styles.module.css";

type MaskedCPFProps = {
  cpf: string;
};

function maskCPF(cpf: string): string {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return `${digits.slice(0, 3)}.***.***-${digits.slice(9)}`;
}

export function MaskedCPF({ cpf }: MaskedCPFProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span className={styles.wrapper}>
      <span className={styles.value}>{visible ? cpf : maskCPF(cpf)}</span>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? "Ocultar CPF" : "Mostrar CPF"}
      >
        {visible ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </span>
  );
}
