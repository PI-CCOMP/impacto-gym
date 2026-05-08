import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { Accordion } from "../../components/Accordion";

export function Faq() {
  return (
    <Container>
      <PageHeader>Perguntas Frequentes</PageHeader>

      {/* Note o uso de &gt; para representar o símbolo de maior que */}
      <Accordion title="Como altero minha senha?">
        Você pode alterar sua senha a qualquer momento. Basta acessar as
        configurações &gt; perfil &gt; alterar senha. Por segurança, o sistema
        solicitará sua senha atual antes de permitir a criação de uma nova. Suas
        senhas são armazenadas de forma protegida em nosso sistema.
      </Accordion>

      <Accordion title="Onde encontro meu treino?">ccc</Accordion>

      <Accordion title="Onde estão as opções de treino?">
        Na opção de treinos no menu. Depois basta escolher o seu treino. Caso
        não tenha peça para um instrutor na academia.
      </Accordion>

      <Accordion title="Como registro os pesos e repetições?">
        Depois de iniciar um treino, na tabela preencha os campos e pronto!
      </Accordion>

      <Accordion title="E se eu não preencher a carga do exercício?">
        O treino não poderá ser finalizado. Para finalizar o treino você precisa
        preencher pelo menos uma linha da tabela.
      </Accordion>

      <Accordion title="Como peço ajuda a um instrutor?">
        Durante o treino clique no nome ou na foto do exercício. No final da
        página você encontra o botão de solicitar auxílio. Depois de chamar
        basta aguardar.
      </Accordion>

      <Accordion title="Onde vejo meu histórico de treinos?">
        Na opção histórico no menu. Lá você encontra treinos que você realizou.
      </Accordion>
    </Container>
  );
}
