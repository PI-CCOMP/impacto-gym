import { DashboardGrid } from "../../components/DashboardGrid";
import { SideMenu } from "../../components/SideMenu";
import { Container } from "../../components/Container";
import { MenuItem } from "../../components/MenuItem";

import { Mail, RectangleEllipsis } from "lucide-react";

export function DashboardSettings() {
  return (
    <DashboardGrid>
      <SideMenu />
      <Container>
        <h1>Configurações</h1>
        <MenuItem
          sectionTitle="E-mail"
          page="alterar-email"
          basePath="dashboard/configuracoes"
        >
          <Mail />
          Alterar E-mail
        </MenuItem>
        <MenuItem
          sectionTitle="Senha"
          page="alterar-senha"
          basePath="dashboard/configuracoes"
        >
          <RectangleEllipsis />
          Alterar Senha
        </MenuItem>
      </Container>
    </DashboardGrid>
  );
}
