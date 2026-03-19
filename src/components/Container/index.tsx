import { useEffect, useState } from "react";
import styles from "./styles.module.css";

type ContainerProps = {
  children: React.ReactNode;
  backgroundImages?: string[];
  timeSeconds?: number;
};

export function Container({
  children,
  backgroundImages,
  timeSeconds = 5,
}: ContainerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!backgroundImages || backgroundImages.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgroundImages.length);
    }, timeSeconds * 1000);

    return () => clearInterval(interval);
  }, [backgroundImages, timeSeconds]);

  if (backgroundImages && backgroundImages.length >= 1) {
    return (
      <div
        className={`${styles.container} ${styles.containerOverlay}`}
        style={{ backgroundImage: `url(${backgroundImages[index]})` }}
      >
        {children}
      </div>
    );
  }

  return <div className={styles.container}>{children}</div>;
}
