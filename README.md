# 🌾 Agro Management API

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
</p>

<p align="center">
  Sistema completo de gerenciamento de produtores rurais, fazendas, safras e culturas plantadas com autenticação e autorização.
</p>

---

## 📋 Sobre o Projeto

A **Agro Management API** é uma aplicação backend robusta desenvolvida para gerenciar o cadastro e controle de produtores rurais, permitindo o registro completo de propriedades, safras e culturas plantadas. O sistema foi projetado seguindo as melhores práticas de desenvolvimento, com arquitetura modular, validações rigorosas, documentação completa e sistema de autenticação seguro.

### 🎯 Funcionalidades Principais

- ✅ **Sistema de Autenticação** - JWT com guards e decorators
- ✅ **Gestão de Usuários** - CRUD completo com controle de ativação
- ✅ **Gestão de Produtores Rurais** - Cadastro completo com CPF/CNPJ
- ✅ **Controle de Fazendas** - Propriedades com áreas detalhadas e validações
- ✅ **Gerenciamento de Safras** - Controle por ano agrícola
- ✅ **Culturas Plantadas** - Registro por fazenda e safra
- ✅ **Validações de Negócio** - Regras específicas do agronegócio
- ✅ **Controle de Propriedade** - Usuários só acessam seus próprios dados
- ✅ **API RESTful** - Endpoints padronizados e documentados
- ✅ **Documentação Swagger** - Interface interativa para testes
- ✅ **Testes Completos** - Unitários e E2E com alta cobertura

---

## 🏗️ Arquitetura e Tecnologias

### **Stack Principal**
- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado do JavaScript
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM type-safe
- **[JWT](https://jwt.io/)** - Autenticação stateless
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Hash de senhas

### **Ferramentas de Desenvolvimento**
- **[Docker](https://www.docker.com/)** - Containerização da aplicação
- **[Swagger/OpenAPI](https://swagger.io/)** - Documentação automática da API
- **[Class Validator](https://github.com/typestack/class-validator)** - Validação de dados
- **[Jest](https://jestjs.io/)** - Framework de testes
- **[ESLint](https://eslint.org/)** - Linting de código
- **[Prettier](https://prettier.io/)** - Formatação de código

### **Arquitetura**
```
src/
├── auth/                # Sistema de autenticação
│   ├── decorators/      # Current user decorator
│   ├── dto/            # DTOs de autenticação
│   ├── guards/         # JWT e Role guards
│   └── strategies/     # Estratégias de autenticação
├── common/             # Utilitários e validators compartilhados
│   └── validators/     # Validadores customizados (CPF/CNPJ)
├── db/                 # Configurações de banco e schemas
│   ├── migrations/     # Migrações do banco
│   └── schema/         # Esquemas das tabelas
├── users/              # Módulo de usuários
├── produtor/           # Módulo de produtores rurais
├── fazendas/           # Módulo de fazendas/propriedades
├── safras/             # Módulo de safras
├── culturas-plantadas/ # Módulo de culturas plantadas
├── env.ts              # Configurações de ambiente
└── main.ts             # Ponto de entrada da aplicação
```

---

## 🚀 Quick Start

### **Pré-requisitos**
- Node.js (versão 18+)
- npm ou yarn
- Docker e Docker Compose
- PostgreSQL (ou usar via Docker)

### **1. Clone o repositório**
```bash
git clone https://github.com/JJoseNetto/agro-back.git
cd agro-back
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure as variáveis de ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Configure suas variáveis no arquivo .env
DATABASE_URL="postgresql://username:password@localhost:5432/agro_db"
PORT=3000
JWT_SECRET="seu_jwt_secret_aqui"
```

### **4. Suba o banco de dados (Docker)**
```bash
docker-compose up -d postgres
```

### **5. Execute as migrações**
```bash
npm run db:migrate
```

### **6. Inicie a aplicação**
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run start:prod
```

A API estará disponível em: `http://localhost:3000`

---

## 📚 Documentação da API

### **Swagger UI**
Acesse a documentação interativa em: `http://localhost:3000/api`

### **Autenticação**
```http
POST   /auth/login         # Login do usuário
```

### **Endpoints Principais**

#### **Usuários**
```http
GET    /users              # Lista todos os usuários
POST   /users              # Cria novo usuário
GET    /users/:id          # Busca usuário por ID
PATCH  /users/:id          # Atualiza usuário
DELETE /users/:id          # Remove usuário
PATCH  /users/:id/toggle-active # Ativa/desativa usuário
```

#### **Produtores** 🔐
```http
GET    /produtor           # Lista produtores do usuário logado
POST   /produtor           # Cria novo produtor
GET    /produtor/:id       # Busca produtor por ID
PUT    /produtor/:id       # Atualiza produtor
DELETE /produtor/:id       # Remove produtor
```

#### **Fazendas** 🔐
```http
GET    /fazendas           # Lista fazendas do usuário logado
POST   /fazendas           # Cria nova fazenda
GET    /fazendas/:id       # Busca fazenda por ID
PUT    /fazendas/:id       # Atualiza fazenda
DELETE /fazendas/:id       # Remove fazenda
```

#### **Safras**
```http
GET    /safras             # Lista todas as safras
POST   /safras             # Cria nova safra
GET    /safras/:id         # Busca safra por ID
PATCH  /safras/:id         # Atualiza safra
DELETE /safras/:id         # Remove safra
```

#### **Culturas Plantadas** 🔐
```http
GET    /culturas-plantadas    # Lista culturas do usuário logado
POST   /culturas-plantadas    # Cria nova cultura
GET    /culturas-plantadas/:id # Busca cultura por ID
PATCH  /culturas-plantadas/:id # Atualiza cultura
DELETE /culturas-plantadas/:id # Remove cultura
```

**🔐** = Endpoints protegidos que requerem autenticação

---

## 🧪 Testes

### **Executar todos os testes**
```bash
npm run test
```

### **Testes com coverage**
```bash
npm run test:cov
```

### **Testes e2e**
```bash
npm run test:e2e
```

### **Testes em modo watch**
```bash
npm run test:watch
```

### **Cobertura de Testes**
- ✅ Testes unitários para todos os serviços
- ✅ Testes de controllers
- ✅ Testes de repositories
- ✅ Testes end-to-end
- ✅ Mocks completos para banco de dados
- ✅ Factories para geração de dados de teste

---

## 🗄️ Banco de Dados

### **Schema Principal**

#### **Users**
- `id` - Identificador único
- `nome` - Nome do usuário
- `email` - Email único
- `password` - Senha hasheada
- `isActive` - Status ativo/inativo
- `createdAt` - Data de criação

#### **Produtores**
- `id` - Identificador único
- `nome` - Nome do produtor
- `cpfOuCnpj` - CPF ou CNPJ (validado e único)
- `userId` - Referência ao usuário proprietário
- `createdAt` - Data de criação

#### **Fazendas**
- `id` - Identificador único
- `nome` - Nome da fazenda
- `cidade` - Cidade da propriedade
- `estado` - Estado (UF)
- `areaTotal` - Área total em hectares
- `areaAgricultavel` - Área agricultável
- `areaVegetacao` - Área de vegetação
- `produtorId` - Referência ao produtor
- `createdAt` - Data de criação

#### **Safras**
- `id` - Identificador único
- `ano` - Ano da safra
- `createdAt` - Data de criação

#### **Culturas Plantadas**
- `id` - Identificador único
- `nome` - Nome da cultura (ex: Soja, Milho)
- `fazendaId` - Referência à fazenda
- `safraId` - Referência à safra
- `createdAt` - Data de criação

### **Relacionamentos e Constraints**
- `users` 1:N `produtores` (CASCADE)
- `produtores` 1:N `fazendas` (CASCADE)
- `fazendas` 1:N `culturas_plantadas` (CASCADE)
- `safras` 1:N `culturas_plantadas` (CASCADE)
- CPF/CNPJ único na tabela produtores
- Email único na tabela users

### **Comandos do Banco**
```bash
# Gerar nova migração
npm run db:generate

# Executar migrações
npm run db:migrate

# Resetar banco
npm run db:reset

# Interface visual do banco
npm run db:studio
```

---

## 🐳 Docker

### **Desenvolvimento com Docker**
```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

### **Build para produção**
```bash
# Build da imagem
docker build -t agro-api .

# Executar container
docker run -p 3000:3000 agro-api
```

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Inicia em modo desenvolvimento
npm run start:debug        # Inicia com debug

# Build e Produção
npm run build              # Build da aplicação
npm run start:prod         # Inicia em modo produção

# Testes
npm run test               # Testes unitários
npm run test:e2e           # Testes end-to-end
npm run test:cov           # Coverage dos testes
npm run test:watch         # Testes em modo watch

# Banco de Dados
npm run db:generate        # Gera migração
npm run db:migrate         # Executa migrações
npm run db:studio          # Interface visual do banco

# Linting e Formatação
npm run lint               # Verifica código
npm run lint:fix           # Corrige problemas
npm run format             # Formata código
```

---

## 📝 Regras de Negócio

### **Validações Implementadas**

1. **CPF/CNPJ** - Validação de formato e dígitos verificadores
2. **Áreas da Fazenda** - Soma de área agricultável + vegetação ≤ área total
3. **Relacionamentos** - Integridade referencial entre entidades
4. **Dados Obrigatórios** - Validação de campos required
5. **Formatos** - Validação de tipos e formatos de dados
6. **Unicidade** - CPF/CNPJ único por produtor, email único por usuário
7. **Propriedade** - Usuários só podem acessar dados próprios
8. **Autenticação** - JWT obrigatório para operações protegidas

### **Relacionamentos**
- Um usuário pode ter **0 a N produtores**
- Um produtor pertence a **1 usuário**
- Um produtor pode ter **0 a N fazendas**
- Uma fazenda pertence a **1 produtor**
- Uma cultura plantada pertence a **1 fazenda** e **1 safra**
- Uma safra pode ter **N culturas plantadas**

### **Sistema de Propriedade**
- Todos os dados são filtrados por usuário logado
- Validação automática de propriedade em operações CRUD
- Cascade delete para manter integridade

---

## 🔐 Autenticação e Autorização

### **Sistema de Autenticação**
- **JWT (JSON Web Tokens)** para autenticação stateless
- **bcrypt** para hash seguro de senhas
- **Guards** personalizados para proteção de rotas
- **Decorators** para extração de dados do usuário

### **Middlewares e Guards**
- `JwtAuthGuard` - Proteção de rotas autenticadas
- `RolesGuard` - Controle de acesso baseado em roles
- `@CurrentUser()` - Decorator para acessar usuário logado

### **Fluxo de Autenticação**
1. Usuário faz login com email/senha
2. Sistema valida credenciais e gera JWT
3. Cliente envia JWT no header Authorization
4. Guards validam token e extraem dados do usuário
5. Rotas protegidas acessam dados filtrados por usuário

---

## 🧩 Padrões e Arquitetura

### **Padrões Implementados**
- **Repository Pattern** - Separação de lógica de acesso a dados
- **DTO Pattern** - Transferência segura de dados
- **Factory Pattern** - Geração de dados para testes
- **Dependency Injection** - Injeção de dependências do NestJS
- **Modular Architecture** - Separação por domínios

### **Estrutura de Módulos**
Cada módulo segue a estrutura:
```
modulo/
├── dto/                # Data Transfer Objects
├── decorators/         # Decorators específicos (se houver)
├── guards/            # Guards específicos (se houver)
├── strategies/        # Estratégias específicas (se houver)
├── test/              # Testes específicos
├── modulo.controller.ts
├── modulo.service.ts
├── modulo.repository.ts
└── modulo.module.ts
```

---

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### **Padrões de Desenvolvimento**
- Seguir convenções do ESLint/Prettier
- Escrever testes para novas funcionalidades
- Documentar APIs com Swagger
- Usar commits convencionais
- Implementar validações de negócio
- Manter cobertura de testes alta

---

## 👨‍💻 Autor

**[JJose Netto](https://github.com/JJoseNetto)**

- GitHub: [@JJoseNetto](https://github.com/JJoseNetto)
- LinkedIn: [Meu LinkedIn](https://www.linkedin.com/in/jjosenetto/)

---