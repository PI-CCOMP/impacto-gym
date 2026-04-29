import styles from "./styles.module.css";

type CheckboxCardProps = {
  image: string;
  labelText: string;
  alt: string;
  name: string;
  checked?: boolean;
  onChange?: (value: string) => void;
} & Omit<React.ComponentProps<"input">, "onChange">;

export function CheckboxCard({
  image,
  alt,
  labelText,
  id,
  name,
  value,
  checked,
  onChange,
}: CheckboxCardProps) {
  function handleClick() {
    onChange?.(value as string);
  }

  return (
    <div className={styles.container}>
      <label htmlFor={id} className={styles.label}>
        <img src={image} alt={alt} className={styles.img} />
        <span>{labelText}</span>
        <input
          type="radio"
          id={id}
          name={name}
          value={value as string}
          checked={checked}
          onChange={handleClick}
          className={styles.input}
          hidden
        />
      </label>
    </div>
  );
}
