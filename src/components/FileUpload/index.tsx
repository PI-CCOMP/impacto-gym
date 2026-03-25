import styles from "./styles.module.css";

import { Upload } from "lucide-react";

type FileUploadProps = {
  labelText: string;
} & React.ComponentProps<"input">;

export function FileUpload({ labelText, id }: FileUploadProps) {
  return (
    <>
      {labelText && (
        <label htmlFor={id} className={styles.label}>
          <Upload className={styles.icon} />
          {labelText}
          <input type="file" id={id} className={styles.input} hidden />
        </label>
      )}
    </>
  );
}
