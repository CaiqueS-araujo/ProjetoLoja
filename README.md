<div align="center">

# 🌸 Anna Vieira — Lash & Brow Designer

</div>

---

## ✨ Sobre o Projeto

Site profissional de agendamento desenvolvido para o studio **Anna Vieira**, especialista em extensão de cílios fio a fio e design de sobrancelhas em Petrópolis - RJ.

O sistema permite que clientes agendem horários diretamente pelo celular, com confirmação via WhatsApp e pagamento do sinal por Pix — tudo sem precisar de aplicativo.

---

## 🖥️ Demonstração

🔗 **[anna-vieira.vercel.app](https://anna-vieira.vercel.app/)**

---

## 🚀 Funcionalidades

### Para a Cliente
- 📅 Agendamento online em 5 passos simples
- 🗓️ Calendário com dias e horários disponíveis em tempo real
- ⏳ Horários bloqueados automaticamente pela duração do serviço
- 💳 Pagamento do sinal via Pix direto na tela
- 💬 Confirmação automática pelo WhatsApp
- 💅 Catálogo completo de serviços com fotos, preços e manutenções

### Para a Anna (Área Admin)
- 🔐 Acesso protegido por senha
- 📋 Agenda visual com calendário colorido por status
- 📅 Gerenciamento de horários — dia único ou vários dias de uma vez
- ✏️ Edição de agendamentos (serviço, valor, desconto, horário)
- 💰 Painel financeiro com receita, despesas, meta mensal e gráfico
- 🎨 Personalização total do tema (cores, fontes, foto de fundo)
- 👤 Edição do perfil, bio, endereço e política de agendamento
- 💬 Templates de mensagens para WhatsApp personalizáveis
- 📸 Upload de fotos com compressão automática no navegador

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| [React 19](https://react.dev/) | Interface |
| [Vite](https://vitejs.dev/) | Build e dev server |
| [Firebase Realtime Database](https://firebase.google.com/) | Banco de dados em tempo real |
| [Vercel](https://vercel.com/) | Deploy e hospedagem |

---

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── admin/          # Painéis da área administrativa
│   │   ├── AAgenda.jsx     # Agenda com calendário visual
│   │   ├── AHorarios.jsx   # Gerenciamento de horários
│   │   ├── AServicos.jsx   # Cadastro de serviços
│   │   ├── AFinance.jsx    # Painel financeiro
│   │   ├── ATheme.jsx      # Personalização visual
│   │   ├── APerfil.jsx     # Dados do perfil
│   │   └── AMensagens.jsx  # Templates de WhatsApp
│   └── shared/         # Componentes reutilizáveis
│       ├── Calendar.jsx    # Calendário interativo
│       ├── ImageUploader.jsx # Upload com compressão
│       └── Navigation.jsx  # Nav e barra inferior
├── pages/              # Páginas do site
│   ├── PageHome.jsx
│   ├── PageBook.jsx    # Fluxo de agendamento
│   ├── PageSvcs.jsx
│   ├── PageAbout.jsx
│   └── PageAdmin.jsx
├── hooks/
│   ├── useStore.js     # Estado global (Firebase)
│   └── useToast.js     # Notificações
├── services/
│   ├── firebase.js     # Configuração Firebase
│   └── database.js     # Operações no banco
├── constants/          # Dados padrão e configurações
├── styles/             # Estilos e tokens visuais
└── utils/              # Funções utilitárias
```
---

## 📍 Studio

**Anna Vieira — Lash & Brow Designer**
Estrada União e Indústria, 10677 — Itaipava, Petrópolis - RJ

---

<div align="center">

Desenvolvido por [Caique Araujo](https://github.com/CaiqueS-araujo)

</div>
