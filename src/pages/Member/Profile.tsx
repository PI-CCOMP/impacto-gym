import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { MenuItem } from "../../components/MenuItem";

import styles from "./Profile.module.css";

import { Mail, RectangleEllipsis } from "lucide-react";

import { mockUser } from "../../mocks/mockData";

export function Profile() {
  return (
    <Container>
      <PageHeader>Modificar Perfil</PageHeader>
      <div className={styles.profile}>
        <img src={mockUser.profilePhoto} className={styles.profilePhoto} />
        <button className={styles.btnChangePassword}>Alterar Senha</button>
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
