# 📦 Backend User API

API de usuários construída com **NestJS**, **PostgreSQL** e boas práticas como autenticação JWT, TDD com Jest e documentação Swagger.

---

## 🚀 Stack Utilizada

- **NestJS** – Framework principal (Node.js + TypeScript)
- **PostgreSQL** – Banco de dados relacional
- **TypeORM** – ORM para integração com o banco
- **JWT** – Autenticação segura
- **Guards + Decorators** – Controle de acesso por perfil (Admin/Client)
- **Swagger** – Documentação automática da API
- **Jest + Supertest** – Testes unitários e de integração
- **Docker + Docker Compose** – Containerização da aplicação e banco
- **CI/CD + Render** – Deploy contínuo (futuro)

---

## 🧰 Pré-requisitos

Antes de começar, instale as seguintes ferramentas:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)
- [Node.js (18+)](https://nodejs.org/en/download)
- [NPM](https://www.npmjs.com/)

---

## 🛠️ Passo a passo para rodar o projeto com Docker

```bash
# 1. Clone o repositório
git clone https://github.com/ganntar/backend-user-api.git
cd backend-user-api

# 2. Crie um arquivo .env baseado no exemplo
cp .env.example .env

# 3. Suba os containers com Docker Compose
docker-compose up --build
```

A aplicação estará disponível em:  
📍 `http://localhost:3000`

Swagger:  
📄 `http://localhost:3000/api`

---

## 🧪 Testes

```bash
# Rodar testes unitários
npm run test:unit

# Rodar testes de integração
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

---
## Notas sobre Swagger

É necessario primeiro criar um usuario para 
utilizar suas credenciais no login, em seguida
copie o access_token gerado para o Authorize,
colando somente o Token.

---

## 📚 Endpoints da API

Todos os endpoints estão documentados no Swagger:  
👉 `http://localhost:3000/api`

### 1. 🧾 Criar usuário

`POST /users/create`  
Cria um novo usuário. A função deve ser `'admin'` ou `'cliente'`.

**Body:**

```json
{
  "nome": "Alex",
  "email": "alex@email.com",
  "senha": "123456",
  "funcao": "cliente"
}
```

🔓 **Acesso:** Público

---

### 2. 🔐 Login

`POST /auth/login`  
Autentica um usuário e retorna um token JWT.

**Body:**

```json
{
  "email": "alex@email.com",
  "senha": "123456"
}
```

🔓 **Acesso:** Público

---

### 3. 🔍 Buscar usuários

`GET /users/find/:query`  
Busca usuários por nome, e-mail ou função (filtro flexível).

**Exemplo:**
```
GET /users/find/alex
```

🔐 **Acesso:** Requer login (JWT no header)

---

### 4. ✏️ Atualizar usuário

`PATCH /users/update/:id`  
Atualiza nome ou função de um usuário.

**Body:**

```json
{
  "nome": "Alex Silva",
  "funcao": "admin"
}
```

🔐 **Acesso:** Requer login (JWT no header)

---

## 🧑‍💻 Perfis de usuário

- `admin`: Acesso total
- `client`: Acesso limitado

---

## ✅ Autenticação e Proteção

As rotas de busca e atualização são protegidas por **JWT Guard**.  
Você deve incluir o token no header da requisição:

```http
Authorization: Bearer <token>
```

---

## 🧾 Scripts úteis

```bash
npm run start        # Modo produção
npm run start:dev    # Modo desenvolvimento
npm run build        # Compila para dist/
```

---

## 📦 Variáveis de Ambiente

Veja o arquivo `.env.example` para configurar sua instância local:

```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=backend_user_api
JWT_SECRET=super-secret-key
JWT_EXPIRES_IN=3600s
```

---

## 🧰 Estrutura do Projeto

```bash
/src
 ├── modules
 │    ├── auth
 │    └── users
 ├── shared
 └── database
/test
.env
Dockerfile
docker-compose.yml
```


Feito com ❤️ por [@ganntar](https://github.com/ganntar)