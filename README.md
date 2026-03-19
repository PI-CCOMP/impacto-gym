# 🏋️ Impacto Gym — Sistema de Ficha de Treino Digital

> Aplicativo web para modernizar o gerenciamento de treinos da academia Impacto Gym, substituindo fichas físicas por uma solução digital centralizada.

---

## 🚧 Status do Projeto

**Em desenvolvimento ativo.** O front-end está sendo construído com componentes individuais e testados. A integração com back-end e API RESTful está prevista para as próximas fases.

---

## 🎯 Objetivo

A Impacto Gym utilizava fichas de papel impressas em bobinas térmicas para registrar treinos — um processo frágil, suscetível a perdas e sem rastreabilidade do progresso dos alunos. Este sistema resolve esses problemas ao:

- Centralizar o histórico de cargas e exercícios de cada aluno
- Permitir que instrutores criem e ajustem planos de treino digitalmente
- Dar aos alunos acesso rápido ao treino do dia pelo smartphone
- Reduzir o uso de papel e otimizar o tempo da equipe

---

## ✅ O que já está pronto

- [x] Levantamento de requisitos com o cliente (visitas, entrevistas, observação)
- [x] Diagramas de Casos de Uso, Fluxo de Dados, Classes e Arquitetura de Software
- [x] Modelagem conceitual, lógica e física do banco de dados (PostgreSQL)
- [x] Protótipo navegável com testes de fluxo via Maze
- [x] Componentização do front-end em React + TypeScript
  - Componentes: `Input`, `Button`, `FileUpload`, dropdowns, checkboxes
  - Estilização com `styled-components`
  - Gerenciamento de estado com hooks (`useState`)
  - Tipagem de props com TypeScript
- [x] Testes unitários estáticos dos componentes (campos, uploads, interações)
- [x] Estrutura de branches no GitHub (`main` + branch de desenvolvimento)
- [x] Novas funcionalidades modeladas e prototipadas:
  - Upload de laudos médicos no cadastro do aluno
  - Sistema de avisos internos da academia
  - Registro de carga por exercício

---

## 🔜 Próximas etapas

- [ ] Implementação do layout completo do front-end
- [ ] Desenvolvimento do back-end com API RESTful + Mascaramento e criptografia de dados sensíveis (CPF, restrições médicas) — conformidade com LGPD
- [ ] Integração front-end ↔ API ↔ banco de dados
- [ ] Testes de qualidade, estabilidade e segurança
- [ ] Funcionalidades futuras: relatórios de desempenho, gamificação, notificações automáticas

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Front-end | React, TypeScript, styled-components |
| Banco de Dados | PostgreSQL |
| Versionamento | Git, GitHub |
| Design / Prototipação | Figma, Maze |
| Gestão do projeto | Jira (Kanban) |
| Modelagem | Astah, Miro, brModelo |

---

## 📁 Estrutura de Branches

```
master          → código estável e revisado
develop         → desenvolvimento de novas features e testes
```

---

## 📄 Artigo

Este projeto é acompanhado de um artigo científico intitulado **"Sistema para Academia: Ficha de Treino Digital"**, desenvolvido como parte da disciplina de Projeto Integrador.
