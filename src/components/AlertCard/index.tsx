import styles from "./styles.module.css";

type AlertCardProps = {
  id: string;
  image: string;
  author: string;
  date: string;
  description: string;
  onClick?: () => void;
};

export function AlertCard({
  id,
  image,
  author,
  date,
  description,
}: AlertCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img src={image} className={styles.img} />
        <div>
          <b>{author}</b>
          <p className={styles.date}>{date}</p>
        </div>
      </div>
      <p>{description}</p>
    </div>
  );
}
