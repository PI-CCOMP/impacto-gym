import { useNavigate, useLocation } from "react-router-dom";

import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { MenuItem } from "../../components/MenuItem";
import { Toast } from "../../components/Toast";

import { User, HelpCircle } from "lucide-react";

import styles from "./Settings.module.css";

type LocationState = {
  showSuccessToast?: boolean;
  toastMessage?: string;
};

export function Settings() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const showToast = state?.showSuccessToast ?? false;
  const toastMessage = state?.toastMessage ?? "Alteração realizada com sucesso!";

  return (
    <Container>
      {showToast && (
        <Toast
          message={toastMessage}
          duration={2000}
          onClose={() =>
            navigate("/configuracoes", { replace: true, state: null })
          }
        />
      )}

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
        <button className={styles.logout} onClick={() => navigate("/")}>
          Sair
        </button>
      </div>
    </Container>
  );
}
