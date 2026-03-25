import styles from "./styles.module.css";

import { ImagePlus } from "lucide-react";

type AvatarUploadProps = { labelText: string } & React.ComponentProps<"input">;

export function AvatarUpload({ labelText, id }: AvatarUploadProps) {
  return (
    <div className={styles.container}>
      {labelText && (
        <label htmlFor={id} className={styles.label}>
          <div className={styles.circle}>
            <ImagePlus />
          </div>
          {labelText}
          <input type="file" id={id} hidden />
        </label>
      )}
    </div>
  );
}
