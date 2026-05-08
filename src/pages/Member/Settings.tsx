import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { MenuItem } from "../../components/MenuItem";

import { User, HelpCircle } from "lucide-react";

import styles from "./Settings.module.css";

export function Settings() {
  return (
    <Container>
      <PageHeader>Configurações</PageHeader>
      <div className={styles.content}>
        <MenuItem sectionTitle="Conta" page="perfil">
          <User />
          Perfil
        </MenuItem>
        <MenuItem sectionTitle="Ajuda" page="faq">
          <HelpCircle />
          Perguntas Frequentes
        </MenuItem>
        <button className={styles.logout}>Sair</button>
      </div>
    </Container>
  );
}
