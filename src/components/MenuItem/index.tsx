import styles from "./styles.module.css";

import { ChevronRight } from "lucide-react";

type MenuItemProps = {
  sectionTitle: string;
  children: React.ReactNode;
};

export function MenuItem({ sectionTitle, children }: MenuItemProps) {
  return (
    <div className={styles.container}>
      {sectionTitle && (
        <span className={styles.sectionTitle}>{sectionTitle}</span>
      )}

      <a href="#" className={styles.menuItem}>
        <div className={styles.leftContent}>{children}</div>
        <ChevronRight className={styles.icon} />
      </a>
    </div>
  );
}
