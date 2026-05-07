import { Link } from "react-router-dom";

import styles from "./styles.module.css";

import { ChevronRight } from "lucide-react";

type MenuItemProps = {
  sectionTitle: string;
  page: string;
  children: React.ReactNode;
};

export function MenuItem({ sectionTitle, page, children }: MenuItemProps) {
  return (
    <Link to={`/configuracao/${page}`}>
      <div className={styles.container}>
        {sectionTitle && (
          <span className={styles.sectionTitle}>{sectionTitle}</span>
        )}

        <div className={styles.menuItem}>
          <div className={styles.leftContent}>{children}</div>
          <ChevronRight className={styles.icon} />
        </div>
      </div>
    </Link>
  );
}
