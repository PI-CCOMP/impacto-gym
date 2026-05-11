import styles from "./styles.module.css";
import { BicepsFlexed } from "lucide-react";

export function Logo() {
  return (
    <figure className={styles.container} aria-label="Impacto Gym">
      <BicepsFlexed className={styles.companyLogo} aria-hidden="true" />
      <figcaption className={styles.companyName}>Impacto Gym</figcaption>
    </figure>
  );
}
