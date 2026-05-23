# 🏋️ Fitness Training Platform

Uma plataforma moderna de gerenciamento de treinos para academias, alunos e administradores, desenvolvida com **React + TypeScript**.

O sistema possui uma experiência completa tanto para **alunos**, permitindo acompanhamento de treinos e progresso, quanto para **administradores/professores**, responsáveis pelo gerenciamento de usuários, treinos e suporte.

---

## ✨ Funcionalidades

### 👤 Área do Aluno
- Cadastro e login
- Recuperação de senha
- Verificação MFA (autenticação)
- Perfil do usuário
- Histórico de treinos
- Visualização de exercícios
- Treinos personalizados
- Solicitação de ajuda
- Avisos da academia
- FAQ e configurações
- Alteração de senha e e-mail

### 🛠️ Dashboard Administrativo
- Login administrativo
- Gestão de usuários
- Criação e edição de alunos
- Gestão de treinos
- Detalhamento de treinos
- Solicitações de auxílio
- Sistema de avisos
- Configurações administrativas
- Alteração de senha e e-mail

---

## 🚀 Tecnologias Utilizadas

- **React**
- **TypeScript**
- **React Router DOM**
- **CSS Modules**
- **Vite**
- **HTML5**
- **CSS3**

---

## 📁 Estrutura do Projeto

```bash
src/
│── assets/            # Imagens, fontes e recursos estáticos
│── components/        # Componentes reutilizáveis
│── hooks/             # Hooks customizados
│── layouts/           # Layouts da aplicação
│── mocks/             # Dados mockados
│── pages/             # Páginas do sistema
│── routes/            # Gerenciamento de rotas
│── styles/            # Estilos globais
│── utils/             # Funções utilitárias
│── validators.ts      # Validações de formulários
│── App.tsx
│── main.tsx
```

---

## 🔐 Recursos de Segurança

O projeto inclui validações como:

- Validação de e-mail
- Confirmação de e-mail
- Validação de CPF
- Senha forte:
  - mínimo de 8 caracteres
  - letra maiúscula
  - letra minúscula
  - número
  - caractere especial
- Confirmação de senha
- MFA (Autenticação Multifator)

---

## 📷 Telas do Sistema

### Área do Aluno
- Home
- Login
- Cadastro
- Treino
- Exercícios
- Histórico
- Perfil
- Configurações
- FAQ

### Dashboard Administrativo
- Gestão de Usuários
- Gestão de Treinos
- Avisos
- Solicitações de Auxílio
- Configurações

---

## 🌐 Rotas Principais

### Usuário
| Página | Rota |
|--------|-------|
| Home | `/inicio` |
| Login | `/login` |
| Registro | `/registro` |
| Treino | `/treino/:idTreino` |
| Exercício | `/exercicio/:idExercicio` |
| Histórico | `/historico` |
| Configurações | `/configuracoes` |

### Dashboard
| Página | Rota |
|--------|-------|
| Login Admin | `/dashboard` |
| Usuários | `/dashboard/usuarios` |
| Treinos | `/dashboard/treinos` |
| Avisos | `/dashboard/avisos` |
| Configurações | `/dashboard/configuracoes` |

---

## 🎯 Objetivo do Projeto

Este projeto foi desenvolvido com foco em:

- Melhorar a experiência do aluno na academia
- Facilitar a gestão de treinos
- Centralizar comunicação e suporte
- Modernizar processos administrativos

---
