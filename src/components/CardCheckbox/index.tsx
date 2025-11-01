import styles from "./styles.module.css";

type CardCheckboxProps = {
  image: string;
  labelText: string;
  alt: string;
} & React.ComponentProps<"input">;

export function CardCheckbox({ image, alt, labelText, id }: CardCheckboxProps) {
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
