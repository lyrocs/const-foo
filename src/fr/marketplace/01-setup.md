## Create git projet

git clone

use latest nvm with pnpm version

## Install Monorepo

pnpm dlx create-turbo@latest

- path: . (no file should be on folder)
- pnpm

delete docs and web on apps

## Create nuxt

npm create nuxt@latest
choose minimal
./apps/front
pnpm
no git

## create Nest

$ npm i -g @nestjs/cli
cd apps
nest new back

- pnpm

create on package.json new dev mode
"dev": "nest start --watch",
pnpm --save @nestjs/config
add on app.module:
import { ConfigModule } from '@nestjs/config';

@Module({
imports: [ConfigModule.forRoot()],
})

create .env

- PORT=3001
