import { Container } from "../../components/Container";
import { MenuItem } from "../../components/MenuItem";

export function Settings() {
  return (
    <Container>
      <MenuItem sectionTitle="Conta" page="perfil">
        Perfil
      </MenuItem>
      <MenuItem sectionTitle="Ajuda" page="faq">
        Perguntas Frequentes
      </MenuItem>
    </Container>
  );
}
