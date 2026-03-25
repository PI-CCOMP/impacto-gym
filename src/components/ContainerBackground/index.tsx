import { useEffect, useState } from "react";
import styles from "./styles.module.css";

type ContainerBackgroundProps = {
  children: React.ReactNode;
  backgroundImages?: string[];
  timeSeconds?: number;
};

export function ContainerBackground({
  children,
  backgroundImages,
  timeSeconds = 5,
}: ContainerBackgroundProps) {
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
        className={styles.containerBackground}
        style={{ backgroundImage: `url(${backgroundImages[index]})` }}
      >
        {children}
      </div>
    );
  }
}

// melhorar qualidade da imagem
