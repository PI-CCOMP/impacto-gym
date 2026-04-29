import { Wrapper } from "./components/Wrapper";
import { Container } from "./components/Container";
import { PageHeader } from "./components/PageHeader";
import { Logo } from "./components/Logo";
import { FormHeader } from "./components/FormHeader";
import { Button } from "./components/Button";
import { ButtonStroke } from "./components/ButtonStroke";
import { Navbar } from "./components/Navbar";
import { MeatballsMenu } from "./components/MeatballsMenu";
import { Input } from "./components/Input/input";
import { FileUpload } from "./components/FileUpload";
import { InputCheckbox } from "./components/InputCheckbox";
import { CheckboxCard } from "./components/CheckboxCard";
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
import { EmptyResultsCard } from "./components/EmptyResultsCard";
import noDataImg from "./assets/img/no-data.png";
import { WorkoutTraining } from "./components/WorkoutTable";
import { TimeAdjust } from "./components/TimeAdjust";

export function Componentes() {
  return (
    <Wrapper>
      <Container>
        <PageHeader>Registro</PageHeader>
        <Logo></Logo>
        <FormHeader>Cadastre-se!</FormHeader>
        <Button>Avançar</Button>
        <ButtonStroke>Voltar</ButtonStroke>
        <MeatballsMenu />
        <Input labelText="Nome" type="text" id="name" placeholder="Arthur" />
        <FileUpload
          labelText="Coloque seu documento ou laudo
 médico liberando a prática de atividades físicas "
        />
        <InputCheckbox labelText="Peito" id="Peito" />
        <CheckboxCard
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
          exerciseName="Supino Reto"
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
        <EmptyResultsCard
          title="O administrador irá validar suas informações e, 
em breve, sua conta estará disponível"
          image={noDataImg}
          alt="Pasta de documentos vazia"
          description="Para qualquer dúvida, entre em contato 
com a recepção da academia"
        />
        <WorkoutTraining trainingActive={false} />
        <WorkoutTraining trainingActive={true} />
        <TimeAdjust />
      </Container>
      {/* <Navbar /> */}
    </Wrapper>
  );
}
