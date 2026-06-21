# Base nestjs

Base nestjs

## Requirements

- Node.js ~ v20.14.0
- npm ~ v10.7.0
- PostgreSQL ~ v14+
- Redis ~ v6+
- Hasura ~ v2.38+

## Usage

### 1. Clone project

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

### 2. Create `.env` file

Copy the content from `.env.example` (or reference below) to `.env` file and configure the values accordingly.

### 3. Environment Variables

#### Config Runtime Environment

```bash
NODE_ENV=development
HOST=localhost
PORT=8888
```

#### Config Hasura

```bash
GRAPHQL_API=http://localhost:8080/v1/graphql
GRAPHQL_SECRET_KEY=
```

#### Config JWT

```bash
JWT_SECRET_KEY=
JWT_EXPIRES_IN=7d
```

#### Config Redis

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

#### Config Email

```bash
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=
MAIL_FROM_NAME=
FORGOT_PASSWORD_EXPIRES_IN=600
```

### 4. Install dependencies

#### Using npm

```bash
npm install
```

#### Using yarn

```bash
yarn
```

### 5. Initialize database (migrations and seed)

#### Run migrations

```bash
npx sequelize-cli db:migrate
```

#### Seed initial data (optional)

```bash
npx sequelize-cli db:seed:all
```

### 6. Start the app in development mode

#### Using npm

```bash
npm run start:dev
```

#### Using yarn

```bash
yarn start:dev
```

### 7. Build the app for production

#### Using npm

```bash
npm run build
```

#### Using yarn

```bash
yarn build
```

### 8. Run production build

```bash
node dist/main.js
```

## Credits

[LeCongTo](https://www.linkedin.com/in/lecongto/).
