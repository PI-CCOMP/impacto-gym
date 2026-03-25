import styles from "./styles.module.css";

import { BicepsFlexed } from "lucide-react";

export function Logo() {
  return (
    <div className={styles.container}>
      <BicepsFlexed className={styles.companyLogo} />
      <span className={styles.companyName}>Impacto Gym</span>
    </div>
  );
}
