import { Container } from "../../components/Container";
import { Row } from "../../components/Row";
import { Logo } from "../../components/Logo";
import { MeatballsMenu } from "../../components/MeatballsMenu";
import { TrainingCard } from "../../components/TrainingCard";
import { Navbar } from "../../components/Navbar";

import supinoImg from "../../assets/img/supino-reto.jpg";

export function Home() {
  return (
    <>
      <Container>
        <Row typeRow="row-space">
          <Logo />
          <MeatballsMenu /> {/* ajustar espaço */}
        </Row>
        <h1>Olá, Arthur!</h1>
        {/* nome vai ter q vir de api e ajustar fundo e espaço */}

        <Container>
          <h2>Selecione o seu treino</h2>
          {/* simular q esses dados vem de api */}

          {/* quando clicar no componente abaixo levar para a pagina desse treino em especifico treino/idtreino ai a pagina vai ser pages/Treino.tsx ela vai ser o molde para receber os dados da api q corresponde a esse treino q foi clicado?é assim? ou tem jeito melhor?*/}
          <TrainingCard
            dataState="current"
            image={supinoImg}
            alt="Foto do treino"
            trainingName="Treino A"
            muscleGroups={["Peitoral", "Abdomên"]}
          />
          <TrainingCard
            dataState=""
            image={supinoImg}
            alt="Foto do treino"
            trainingName="Treino A"
            muscleGroups={["Peitoral", "Abdomên"]}
          />
          <TrainingCard
            dataState=""
            image={supinoImg}
            alt="Foto do treino"
            trainingName="Treino A"
            muscleGroups={["Peitoral", "Abdomên"]}
          />
        </Container>
      </Container>
      <Navbar />
    </>
  );
}
