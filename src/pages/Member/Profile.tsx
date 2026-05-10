import { useRef, useState } from "react";
import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { MenuItem } from "../../components/MenuItem";

import styles from "./Profile.module.css";

import { Mail, RectangleEllipsis } from "lucide-react";

import { mockUser } from "../../mocks/mockData";

export function Profile() {
  const [photo, setPhoto] = useState(mockUser.profilePhoto);
  const inputRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhoto(url);
  }

  return (
    <Container>
      <PageHeader>Modificar Perfil</PageHeader>
      <div className={styles.profile}>
        <img src={photo} className={styles.profilePhoto} />
        <button
          className={styles.btnChangePassword}
          onClick={() => inputRef.current?.click()}
        >
          Alterar Foto
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.svg"
          style={{ display: "none" }}
          onChange={handlePhotoChange}
        />
      </div>
      <MenuItem sectionTitle="E-mail" page="alterar-email">
        <Mail />
        Alterar E-mail
      </MenuItem>
      <MenuItem sectionTitle="Senha" page="alterar-senha">
        <RectangleEllipsis />
        Alterar Senha
      </MenuItem>
    </Container>
  );
}
