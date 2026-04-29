import { useState } from "react";
import { Upload, FileText } from "lucide-react";
import styles from "./styles.module.css";

type FileUploadProps = {
  children?: React.ReactNode;
  onFileChange?: (file: File | null) => void;
} & Omit<React.ComponentProps<"input">, "onChange" | "type" | "accept">;

export function FileUpload({ children, id, onFileChange }: FileUploadProps) {
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      setFileName("");
      setError("");
      onFileChange?.(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setFileName("");
      setError("Apenas arquivos PDF são aceitos.");
      onFileChange?.(null);
      e.target.value = "";
      return;
    }

    setError("");
    setFileName(file.name);
    onFileChange?.(file);
  }

  return (
    <>
      {children && (
        <label htmlFor={id} className={styles.label}>
          <Upload className={styles.icon} />
          {children}
          <input
            type="file"
            id={id}
            accept="application/pdf"
            onChange={handleChange}
            className={styles.input}
            hidden
          />
        </label>
      )}

      {fileName && (
        <p className={styles.fileName}>
          <FileText /> {fileName}
        </p>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </>
  );
}
