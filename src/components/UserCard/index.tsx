import styles from "./styles.module.css";

type UserCardProps = {
  id: string;
  image: string;
  name: string;
  cpf: string;
  instructor?: string;
  onClick?: () => void;
};

export function UserCard({ id, image, name, cpf, instructor }: UserCardProps) {
  return (
    <div className={styles.container}>
      <img src={image} alt={name} className={styles.img} />
      <div className={styles.content}>
        <p>{name}</p>
        <p>
          <b>CPF: </b>
          {cpf}
        </p>
        {instructor && (
          <p>
            <b>Instrutor: </b>
            {instructor}
          </p>
        )}
      </div>
    </div>
  );
}
