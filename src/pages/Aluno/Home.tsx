import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container } from "../../components/Container";
import { Row } from "../../components/Row";
import { Logo } from "../../components/Logo";
import { MeatballsMenu } from "../../components/MeatballsMenu";
import { TrainingCard } from "../../components/TrainingCard";
import { Navbar } from "../../components/Navbar";
import { Button } from "../../components/Button";
import { ButtonStroke } from "../../components/ButtonStroke";

import {
  getActiveTraining,
  clearActiveTraining,
} from "../../utils/activeTrainig";

import supinoImg from "../../assets/img/supino-reto.jpg";

const mockUser = { name: "Arthur" };

const mockTrainings = [
  {
    id: "1",
    image: supinoImg,
    alt: "Foto do treino A",
    trainingName: "Treino A",
    muscleGroups: ["Peitoral", "Abdômen"],
  },
  {
    id: "2",
    image: supinoImg,
    alt: "Foto do treino B",
    trainingName: "Treino B",
    muscleGroups: ["Costas", "Bíceps"],
  },
  {
    id: "3",
    image: supinoImg,
    alt: "Foto do treino C",
    trainingName: "Treino C",
    muscleGroups: ["Pernas", "Glúteos"],
  },
];

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

  return (
    <>
      <Container>
        <Row typeRow="row-space">
          <Logo />
          <MeatballsMenu />
        </Row>
        <h1>Olá, {mockUser.name}!</h1>

        {activeTraining?.isActive && (
          <div
            style={{
              backgroundColor: "var(--primary-light)",
              border: "var(--size-xxs) solid var(--secondary)",
              borderRadius: "var(--size-sm)",
              padding: "var(--size-md)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--size-sm)",
            }}
          >
            <p>Treino em andamento</p>
            <strong>{activeTraining.trainingName}</strong>
            <p>Quer continuar de onde parou?</p>
            <Button onClick={() => navigate(`/treino/${activeTraining.id}`)}>
              Continuar
            </Button>
            <ButtonStroke onClick={handleEncerrar}>Encerrar</ButtonStroke>
          </div>
        )}

        <Container>
          <h2>Selecione o seu treino</h2>

          {mockTrainings.map((training) => (
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
          ))}
        </Container>
      </Container>
      <Navbar />
    </>
  );
}
