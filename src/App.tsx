import "./styles/theme.css";
import "./styles/global.css";

import { Wrapper } from "./components/Wrapper";
import { Container } from "./components/Container";
import { PageHeader } from "./components/PageHeader";
import { Logo } from "./components/Logo";
import { AuthFormHeader } from "./components/AuthFormHeader";
import { Button } from "./components/Button";
import { ButtonStroke } from "./components/ButtonStroke";
import { Navbar } from "./components/Navbar";
import { MeatballsMenu } from "./components/MeatballsMenu";
import { Input } from "./components/Input/input";
import { FileUpload } from "./components/FileUpload";
import { InputCheckbox } from "./components/InputCheckbox";
import { CardCheckbox } from "./components/CardCheckbox";
import maleImg from "./assets/img/male.png";
import { AvatarUpload } from "./components/AvatarUpload";
import { Line } from "./components/Line";
import { TrainingCard } from "./components/TrainingCard";
import supinoImg from "./assets/img/supino-reto.jpg";
import { ExerciseCard } from "./components/ExerciseCard";
import { TrainingHeader } from "./components/TrainingHeader";
import { MenuItem } from "./components/MenuItem";
import { User } from "lucide-react";
import { FaqItem } from "./components/FaqItem";

function App() {
  return (
    <Wrapper>
      <Container>
        <PageHeader>Registro</PageHeader>
        <Logo></Logo>
        <AuthFormHeader>Cadastre-se!</AuthFormHeader>
        <Button>Avançar</Button>
        <ButtonStroke>Voltar</ButtonStroke>
        <MeatballsMenu />
        <Input labelText="Nome" type="text" id="name" placeholder="Arthur" />
        <FileUpload
          labelText="Coloque seu documento ou laudo
 médico liberando a prática de atividades físicas "
        />
        <InputCheckbox labelText="Peito" id="Peito" />
        <CardCheckbox
          image={maleImg}
          alt="Homem "
          labelText="Masculino"
          id="Masculino"
        />
        <AvatarUpload labelText="Inserir foto de perfil" id="avatar-upload" />
        <Line />
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
        <ExerciseCard
          image={supinoImg}
          alt="Supino Reto"
          ExerciseName="Supino Reto"
        />
        <TrainingHeader
          muscleGroups={["Peitoral", "Abdomên"]}
          author="Arthur"
        />
        <MenuItem sectionTitle="Conta" itemName="Perfil">
          <User />
        </MenuItem>
        <FaqItem
          faqTitle="Como altero minha senha?"
          faqDescription="Você pode alterar sua senha a qualquer momento. Basta acessar as configurações > perfil > alterar senha. Por segurança, o sistema solicitará sua senha atual antes de permitir a criação de uma nova. Suas senhas são armazenadas de forma protegida em nosso sistema."
        />
      </Container>
      <Navbar />
    </Wrapper>
  );
}

export default App;
