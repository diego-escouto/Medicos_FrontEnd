# Medicos Frontend

Projeto frontend React para gerenciamento de médicos e clínicas.

Desenvolvido por Diego Escouto para fins de aprendizado e prática profissional.

Este repositório contém a interface web (Vite + React) que consome a API backend fornecida separadamente.

## Principais recursos

- Listagem de médicos e suas clínicas
- Edição inline de clínicas a partir da lista de médicos
- Criação de médicos com opção de vincular uma clínica
- Autenticação com refresh token (fluxo implementado no frontend)

## Pré-requisitos

- Node.js 16+ e npm
- Backend da API disponível e configurado (variável de ambiente `VITE_API_BASE_URL`)

## Instalação e execução

1. Instale dependências:

```bash
npm install
```

2. Defina a variável de ambiente (ex.: em `.env` ou no seu ambiente de desenvolvimento):

```bash
VITE_API_BASE_URL=https://api.seu-backend.local
```

3. Execute em modo de desenvolvimento:

```bash
npm run dev
```

4. Build para produção:

```bash
npm run build
```

## Estrutura relevante

- `src/pages/medicos/MedicosList.jsx` — lista de médicos e integração com o painel de clínicas
- `src/components/Clinicas/MedicoClinicasPanel.jsx` — painel expandido com edição de clínicas
- `src/components/medicos/MedicoCreateForm.jsx` — formulário de criação de médico (com opção de criar/vincular clínica)
- `src/auth` — contexto e hooks de autenticação (`AuthContext`, `useAuthFetch`)

## Variáveis de ambiente

- `VITE_API_BASE_URL` — URL base da API (ex.: `https://api.example.com`).

Observação: o frontend utiliza cookies para o refresh token; por isso, no backend é preciso habilitar CORS e enviar `Set-Cookie` corretamente quando em produção.

## Testes e verificação rápida

- Abra a rota de criação de médico e verifique se o checkbox "Criar e vincular uma clínica" aparece.
- Na lista de médicos, clique em um médico para abrir o painel de clínicas e testar a edição.

## Erros comuns / Dicas

- Se o frontend não conseguir se comunicar com o backend, verifique `VITE_API_BASE_URL` e CORS no backend.
- Se o dark mode não refletir nas áreas adicionadas, use classes Bootstrap compatíveis com `data-bs-theme` (ex.: `bg-body`).

## Contribuição

Pull requests são bem-vindos. Para mudanças maiores, abra uma issue descrevendo o objetivo.

## Licença

Projeto destinado a fins de aprendizado; ajuste a licença conforme necessário para uso público ou comercial.

---

Desenvolvido por Diego Escouto — Aprendizado e demonstração de conceitos em React e integração com APIs.

# FrontEnd em produção

[site frontend](https://medicos-frontend-1.onrender.com)