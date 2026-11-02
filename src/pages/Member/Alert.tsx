import { useEffect, useState } from "react";
import { Container } from "../../components/Container";
import { Row } from "../../components/Row";
import { MeatballsMenu } from "../../components/MeatballsMenu";
import { Logo } from "../../components/Logo";
import { AlertCard } from "../../components/AlertCard";
import { Line } from "../../components/Line";
import { Navbar } from "../../components/Navbar";

import { formatDateTime } from "../../utils/formatDate";
import { apiGet, fotoPerfilPrivadaPorUrl } from "../../services/api";
import anonymousImg from "../../assets/img/profile/anonymous.png";

type Notice = {
  id_aviso: number;
  titulo: string;
  mensagem: string;
  publicado_em: string;
  autor: { nome: string; foto_url: string | null };
  autorFoto: string;
};

export function Alert() {
  const [alerts, setAlerts] = useState<Notice[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadAlerts() {
      try {
        const result = await apiGet<{ dados: Omit<Notice, "autorFoto">[] }>("/avisos");
        let photoFailed = false;
        const notices = await Promise.all(
          result.dados.map(async (notice) => {
            try {
              return {
                ...notice,
                autorFoto:
                  (await fotoPerfilPrivadaPorUrl(notice.autor.foto_url)) ??
                  anonymousImg,
              };
            } catch {
              photoFailed = true;
              return { ...notice, autorFoto: anonymousImg };
            }
          }),
        );
        if (active) {
          setAlerts(notices);
          if (photoFailed) setError("Não foi possível carregar uma ou mais fotos dos autores.");
        }
      } catch (requestError: unknown) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar os avisos.",
          );
        }
      }
    }
    void loadAlerts();
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Container>
        <Row typeRow="row-space">
          <Logo />
          <MeatballsMenu />
        </Row>

        <h1>Avisos</h1>
        {error && <p role="alert">{error}</p>}
        {!error && alerts.length === 0 && <p>Nenhum aviso publicado.</p>}

        {alerts.map((alert, index) => (
          <div key={alert.id_aviso}>
            <AlertCard
              id={String(alert.id_aviso)}
              author={alert.autor.nome}
              image={alert.autorFoto}
              date={formatDateTime(new Date(alert.publicado_em).getTime())}
              description={alert.mensagem}
            />
            {alerts.length > 1 && index < alerts.length - 1 && <Line />}
          </div>
        ))}
      </Container>

      <Navbar />
    </>
  );
}
