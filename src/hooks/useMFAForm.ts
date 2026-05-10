import { useState, useRef, useEffect } from "react";

export function useMFAForm(onSuccess: (code: string) => void) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const updated = [...digits];
    updated[index] = digit;
    setDigits(updated);
    setError("");
    if (digit && index < 3) inputsRef.current[index + 1]?.focus();
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 4) {
      setError("Digite o código completo de 4 dígitos.");
      return;
    }
    onSuccess(code);
  }

  return {
    digits,
    error,
    inputsRef,
    handleDigitChange,
    handleKeyDown,
    handleSubmit,
  };
}
