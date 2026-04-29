import styles from "./styles.module.css";

import { ImagePlus } from "lucide-react";

type AvatarUploadProps = {
  children?: React.ReactNode;
} & React.ComponentProps<"input">;

export function AvatarUpload({ children, id }: AvatarUploadProps) {
  return (
    <div className={styles.container}>
      {children && (
        <label htmlFor={id} className={styles.label}>
          <div className={styles.circle}>
            <ImagePlus />
          </div>
          {children}
          <input type="file" id={id} hidden />
        </label>
      )}
    </div>
  );
}
