import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container } from "../../components/Container";
import { Row } from "../../components/Row";
import { Logo } from "../../components/Logo";
import { MeatballsMenu } from "../../components/MeatballsMenu";
import { TrainingCard } from "../../components/TrainingCard";
import { Navbar } from "../../components/Navbar";
import { ActiveTrainingCard } from "../../components/ActiveTrainingCard";
import { Line } from "../../components/Line";
import { EmptyResultsCard } from "../../components/EmptyResultsCard";

import noDataImg from "../../assets/img/undraw_no-data_ig65.svg";

import {
  getActiveTraining,
  clearActiveTraining,
} from "../../utils/activeTrainig";

import { mockUser, mockTrainings } from "../../mocks/mockData";

export function Home() {
  const navigate = useNavigate();
  const [activeTraining, setActiveTrainingState] =
    useState(getActiveTraining());

  useEffect(() => {
    const handleFocus = () => setActiveTrainingState(getActiveTraining());
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleEncerrar = () => {
    clearActiveTraining();
    setActiveTrainingState(null);
  };

  const activeTrainingData = mockTrainings.find(
    (t) => t.id === activeTraining?.id,
  );
  const totalSeries = activeTrainingData
    ? activeTrainingData.exercises.reduce(
        (acc, ex) => acc + ex.series.length,
        0,
      )
    : 0;

  return (
    <>
      <Container>
        <Row typeRow="row-space">
          <Logo />
          <MeatballsMenu />
        </Row>
        <h1>Olá, {mockUser.name}!</h1>

        {activeTraining?.isActive && (
          <>
            <ActiveTrainingCard
              trainingId={activeTraining.id}
              trainingName={activeTraining.trainingName}
              checkedCount={activeTraining.checkedSeries?.length ?? 0}
              totalSeries={totalSeries}
              onFinish={handleEncerrar}
            />
            <Line />
          </>
        )}
        <h2>Selecione o seu treino</h2>

        {mockTrainings.length === 0 ? (
          <EmptyResultsCard
            title="Nenhum treino encontrado"
            image={noDataImg}
            alt="Nenhum treino disponível"
            description="Você ainda não possui treinos cadastrados. Aguarde o instrutor configurar sua ficha."
          />
        ) : (
          mockTrainings.map((training) => (
            <div
              key={training.id}
              onClick={() => navigate(`/treino/${training.id}`)}
            >
              <TrainingCard
                dataState={
                  activeTraining?.isActive && activeTraining.id === training.id
                    ? "current"
                    : ""
                }
                image={training.image}
                alt={training.alt}
                trainingName={training.trainingName}
                muscleGroups={training.muscleGroups}
              />
            </div>
          ))
        )}
      </Container>
      <Navbar />
    </>
  );
}
