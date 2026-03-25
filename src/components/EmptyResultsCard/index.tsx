import styles from "./styles.module.css";

type EmptyResultsCardProps = {
  title: string;
  image: string;
  alt: string;
  description: string;
};

export function EmptyResultsCard({
  title,
  image,
  alt,
  description,
}: EmptyResultsCardProps) {
  return (
    <article className={styles.article}>
      <h4 className={styles.title}>{title}</h4>
      <img src={image} alt={alt} className={styles.img} />
      <p className={styles.description}>{description}</p>
    </article>
  );
}
