import styles from "./styles.module.css";

type CheckboxCardProps = {
  image: string;
  labelText: string;
  alt: string;
} & React.ComponentProps<"input">;

export function CheckboxCard({ image, alt, labelText, id }: CheckboxCardProps) {
  return (
    <div className={styles.container}>
      <label htmlFor={id} className={styles.label}>
        <img src={image} alt={alt} className={styles.img} />
        <span>{labelText}</span>
        <input type="checkbox" id={id} className={styles.input} hidden />
      </label>
    </div>
  );
}
