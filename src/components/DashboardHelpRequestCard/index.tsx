import { ActionButton } from "../../components/ActionButton";
import { Check } from "lucide-react";

import styles from "./styles.module.css";

type DashboardHelpRequestCardProps = {
  userName: string;
  userImage: string;
  exerciseName: string;
  onAccept: () => void;
};

export function DashboardHelpRequestCard({
  userName,
  userImage,
  exerciseName,
  onAccept,
}: DashboardHelpRequestCardProps) {
  return (
    <div
      className={styles.container}
      style={{ justifyContent: "space-between" }}
    >
      <div
        style={{ display: "flex", gap: "var(--size-md)", alignItems: "center" }}
      >
        <img src={userImage} className={styles.img} alt={userName} />

        <div className={styles.content}>
          <p>
            <strong>{userName}</strong>
          </p>
          <p>
            <span style={{ color: "var(--text-defaul)" }}>Exercício: </span>
            {exerciseName}
          </p>
        </div>
      </div>

      <ActionButton
        icon={<Check size={18} />}
        variant="accept"
        onClick={onAccept}
      />
    </div>
  );
}
